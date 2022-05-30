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
import { buildUrlQueryString, useLocationQuery, deriveURLParamsFromLocation } from '../../../utils/routing';
import { MainPageStatuses } from './MainPage.constants';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';
import { LockedSelector } from '../../LockedSelector';

const mapStateToProps = (state: ReduxState) => ({
    error: state.activePage.selectionsError && state.activePage.selectionsError.error, // TODO: Should probably remove this
    ready: !state.activePage.lockedSelectorLoads,  // TODO: Should probably remove this
});

const showMainPage = (selectedProgram, orgUnitId, displayFrontPageList, selectedTemplateId) => {
    const noProgramSelected = !selectedProgram;
    const noOrgUnitSelected = !orgUnitId;
    const isEventProgram = !selectedProgram?.trackedEntityType?.id;

    return (
        noProgramSelected ||
        noOrgUnitSelected ||
        isEventProgram ||
        displayFrontPageList ||
        selectedTemplateId
    );
};

const MainPageContainer = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { all } = useLocationQuery();
    const showAllAccessible = all !== undefined;

    const {
        currentSelectionsComplete,
        programId,
        orgUnitId,
        categories,
        searchStatus,
        error,
        ready,
    } = useSelector(
        ({ currentSelections, searchPage, activePage }) => ({
            currentSelectionsComplete: currentSelections.complete,
            programId: currentSelections.programId,
            orgUnitId: currentSelections.orgUnitId,
            categories: currentSelections.categories,
            searchStatus: searchPage.searchStatus,
            ready: !activePage.isLoading && !activePage.lockedSelectorLoads,
            error: activePage.selectionsError && activePage.selectionsError.error,
        }),
        shallowEqual,
    );
    const { selectedTemplateId } = deriveURLParamsFromLocation();
    const selectedProgram = programId && programCollection.get(programId);
    const trackedEntityTypeId = selectedProgram?.trackedEntityType?.id;
    const displayFrontPageList = trackedEntityTypeId && selectedProgram?.displayFrontPageList;

    const availableSearchOptions = useSearchOptions();
    const dispatchShowInitialSearchPage = useCallback(
        () => { dispatch(showInitialViewOnSearchPage()); }, [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(
        () => { dispatch(cleanSearchRelatedData()); }, [dispatch]);

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

    const setShowAccessible = () => history
        .push(`/?${buildUrlQueryString({ programId })}&all`);

    const MainPageStatus = useMemo(() => {
        if (selectedProgram?.categoryCombination) {
            const buildCategoryCombinationStatus = () => {
                if (!categories) return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
                const programCategories = Array.from(selectedProgram.categoryCombination.categories.values());

                if (programCategories.some(category => !categories || !categories[category.id])) {
                    return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
                }

                if (!orgUnitId && !showAllAccessible) {
                    return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
                }

                return MainPageStatuses.SHOW_WORKING_LIST;
            };
            return buildCategoryCombinationStatus();
        }

        if (currentSelectionsComplete || (programId && showAllAccessible)) {
            return MainPageStatuses.SHOW_WORKING_LIST;
        } else if (programId && !orgUnitId) {
            return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
        }
        return MainPageStatuses.DEFAULT;
    },
    [categories, currentSelectionsComplete, orgUnitId, programId, selectedProgram, showAllAccessible]);

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <LockedSelector />
            <>
                {showMainPage(selectedProgram, orgUnitId, displayFrontPageList, selectedTemplateId) ? (
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
