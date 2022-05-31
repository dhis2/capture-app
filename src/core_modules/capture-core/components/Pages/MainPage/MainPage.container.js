// @flow
import React, { useEffect, useMemo, useCallback } from 'react';
// $FlowFixMe
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { SearchPageComponent, cleanSearchRelatedData, showInitialViewOnSearchPage } from '../Search';
import { useSearchOptions } from '../../../hooks';
import { MainPageComponent } from './MainPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { updateShowAccessibleStatus } from '../actions/crossPage.actions';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { MainPageStatuses } from './MainPage.constants';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';
import { TopBar } from './TopBar.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.activePage.selectionsError && state.activePage.selectionsError.error, // TODO: Should probably remove this
    ready: !state.activePage.lockedSelectorLoads,  // TODO: Should probably remove this
});

const showMainPage = ({ programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId }) => {
    const noProgramSelected = !programId;
    const noOrgUnitSelected = !orgUnitId;
    const isEventProgram = !trackedEntityTypeId;

    return noProgramSelected || noOrgUnitSelected || isEventProgram || displayFrontPageList || selectedTemplateId;
};

const MainPageContainer = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { all, programId, orgUnitId, selectedTemplateId } = useLocationQuery();
    const showAllAccessible = all !== undefined;

    const { categories, selectedCategories, searchStatus, error, ready } = useSelector(
        ({ currentSelections, searchPage, activePage }) => ({
            categories: currentSelections.categories,
            selectedCategories: currentSelections.categoriesMeta,
            searchStatus: searchPage.searchStatus,
            ready: !activePage.isLoading && !activePage.lockedSelectorLoads,
            error: activePage.selectionsError && activePage.selectionsError.error,
        }),
        shallowEqual,
    );
    const selectedProgram = programCollection.get(programId);
    // $FlowFixMe[prop-missing]
    const trackedEntityTypeId = selectedProgram?.trackedEntityType?.id;
    const displayFrontPageList = trackedEntityTypeId && selectedProgram?.displayFrontPageList;
    const availableSearchOptions = useSearchOptions();

    const dispatchShowInitialSearchPage = useCallback(() => {
        dispatch(showInitialViewOnSearchPage());
    }, [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(() => {
        dispatch(cleanSearchRelatedData());
    }, [dispatch]);

    useEffect(() => {
        dispatch(updateShowAccessibleStatus(showAllAccessible));
    }, [showAllAccessible, dispatch]);

    useEffect(() => {
        if (programId && trackedEntityTypeId && displayFrontPageList && selectedTemplateId === undefined) {
            orgUnitId &&
                history.push(
                    `/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId: `${programId}-default` })}`,
                );

            showAllAccessible &&
                history.push(`/?${buildUrlQueryString({ programId, selectedTemplateId: `${programId}-default` })}&all`);
        }
    }, [
        selectedTemplateId,
        orgUnitId,
        programId,
        showAllAccessible,
        trackedEntityTypeId,
        displayFrontPageList,
        history,
    ]);

    const setShowAccessible = () => history.push(`/?${buildUrlQueryString({ programId })}&all`);

    const withoutOrgUnit = useMemo(() => !orgUnitId && !showAllAccessible, [orgUnitId, showAllAccessible]);

    const MainPageStatus = useMemo(() => {
        if (!programId) return MainPageStatuses.DEFAULT;

        if (selectedProgram?.categoryCombination) {
            if (!categories) return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
            const programCategories = Array.from(selectedProgram.categoryCombination.categories.values());

            if (programCategories.some(category => !categories || !categories[category.id])) {
                return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
            }

            if (withoutOrgUnit) {
                return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
            }

            return MainPageStatuses.SHOW_WORKING_LIST;
        }

        if (withoutOrgUnit) {
            return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
        }
        return MainPageStatuses.SHOW_WORKING_LIST;
    }, [categories, programId, withoutOrgUnit, selectedProgram]);

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <TopBar programId={programId} orgUnitId={orgUnitId} selectedCategories={selectedCategories} />
            <>
                {showMainPage({ programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId }) ? (
                    <MainPageComponent
                        MainPageStatus={MainPageStatus}
                        programId={programId}
                        orgUnitId={orgUnitId}
                        selectedTemplateId={selectedTemplateId}
                        setShowAccessible={setShowAccessible}
                        error={error}
                        ready={ready}
                    />
                ) : (
                    <SearchPageComponent
                        showInitialSearchPage={dispatchShowInitialSearchPage}
                        cleanSearchRelatedInfo={dispatchCleanSearchRelatedData}
                        availableSearchOptions={availableSearchOptions}
                        preselectedProgramId={programId}
                        trackedEntityTypeId={trackedEntityTypeId}
                        searchStatus={searchStatus}
                        error={error}
                        ready={ready}
                    />
                )}
            </>
        </OrgUnitFetcher>
    );
};

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(MainPageContainer)));
