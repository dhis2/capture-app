// @flow
import React, { useEffect, useMemo, useCallback } from 'react';
// $FlowFixMe
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import {
    SearchPageComponent,
    cleanSearchRelatedData,
    navigateToNewUserPage,
    showInitialViewOnSearchPage,
} from '../Search';
import { useSearchOptions } from '../../../hooks';
import { MainPageComponent } from './MainPage.component';
import { withLoadingIndicator } from '../../../HOC';
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

const handleChangeTemplateUrl = ({ programId, orgUnitId, selectedTemplateId, showAllAccessible, history }) => {
    if (orgUnitId) {
        selectedTemplateId
            ? history.push(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId })}`)
            : history.push(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }
    if (showAllAccessible) {
        selectedTemplateId
            ? history.push(`/?${buildUrlQueryString({ programId, selectedTemplateId })}&all`)
            : history.push(`/?${buildUrlQueryString({ programId })}&all`);
    }
};

const useMainPageStatus = ({ programId, selectedProgram, categories, orgUnitId, showAllAccessible }) => {
    const withoutOrgUnit = useMemo(() => !orgUnitId && !showAllAccessible, [orgUnitId, showAllAccessible]);

    return useMemo(() => {
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
};

const useSelectorMainPage = () =>
    useSelector(
        ({ currentSelections, searchPage, activePage }) => ({
            categories: currentSelections.categories,
            selectedCategories: currentSelections.categoriesMeta,
            searchStatus: searchPage.searchStatus,
            ready: !activePage.isLoading && !activePage.lockedSelectorLoads,
            error: activePage.selectionsError && activePage.selectionsError.error,
            searchableFields: searchPage.searchableFields,
            minAttributesRequiredToSearch: searchPage.minAttributesRequiredToSearch,
        }),
        shallowEqual,
    );

const useCallbackMainPage = ({ orgUnitId, programId, showAllAccessible, history, dispatch }) => {
    const dispatchShowInitialSearchPage = useCallback(() => dispatch(showInitialViewOnSearchPage()), [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(() => dispatch(cleanSearchRelatedData()), [dispatch]);
    const dispatchNavigateToNewUserPage = useCallback(() => dispatch(navigateToNewUserPage()), [dispatch]);
    const onChangeTemplate = useCallback(
        id => handleChangeTemplateUrl({ programId, orgUnitId, selectedTemplateId: id, showAllAccessible, history }),
        [history, orgUnitId, programId, showAllAccessible],
    );

    const onSetShowAccessible = useCallback(
        () => history.push(`/?${buildUrlQueryString({ programId })}&all`),
        [history, programId],
    );

    return {
        dispatchShowInitialSearchPage,
        dispatchCleanSearchRelatedData,
        dispatchNavigateToNewUserPage,
        onChangeTemplate,
        onSetShowAccessible,
    };
};

const MainPageContainer = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { all, programId, orgUnitId, selectedTemplateId } = useLocationQuery();
    const showAllAccessible = all !== undefined;

    const {
        categories,
        selectedCategories,
        searchStatus,
        searchableFields,
        minAttributesRequiredToSearch,
        error,
        ready,
    } = useSelectorMainPage();

    const selectedProgram = programCollection.get(programId);
    // $FlowFixMe[prop-missing]
    const trackedEntityTypeId = selectedProgram?.trackedEntityType?.id;
    const displayFrontPageList = trackedEntityTypeId && selectedProgram?.displayFrontPageList;
    const availableSearchOptions = useSearchOptions();
    const MainPageStatus = useMainPageStatus({ programId, selectedProgram, categories, orgUnitId, showAllAccessible });

    const {
        dispatchShowInitialSearchPage,
        dispatchCleanSearchRelatedData,
        dispatchNavigateToNewUserPage,
        onChangeTemplate,
        onSetShowAccessible,
    } = useCallbackMainPage({ orgUnitId, programId, showAllAccessible, history, dispatch });

    useEffect(() => {
        dispatch(updateShowAccessibleStatus(showAllAccessible));
    }, [showAllAccessible, dispatch]);

    useEffect(() => {
        if (programId && trackedEntityTypeId && displayFrontPageList && selectedTemplateId === undefined) {
            handleChangeTemplateUrl({
                programId,
                orgUnitId,
                selectedTemplateId: `${programId}-default`,
                showAllAccessible,
                history,
            });
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


    return (
        <OrgUnitFetcher orgUnitId={orgUnitId} error={error}>
            <TopBar programId={programId} orgUnitId={orgUnitId} selectedCategories={selectedCategories} />
            <>
                {showMainPage({ programId, orgUnitId, trackedEntityTypeId, displayFrontPageList, selectedTemplateId }) ? (
                    <MainPageComponent
                        MainPageStatus={MainPageStatus}
                        programId={programId}
                        orgUnitId={orgUnitId}
                        selectedTemplateId={selectedTemplateId}
                        setShowAccessible={onSetShowAccessible}
                        onChangeTemplate={onChangeTemplate}
                        error={error}
                        ready={ready}
                    />
                ) : (
                    <SearchPageComponent
                        showInitialSearchPage={dispatchShowInitialSearchPage}
                        cleanSearchRelatedInfo={dispatchCleanSearchRelatedData}
                        navigateToRegisterUser={dispatchNavigateToNewUserPage}
                        availableSearchOptions={availableSearchOptions}
                        preselectedProgramId={programId}
                        trackedEntityTypeId={trackedEntityTypeId}
                        searchStatus={searchStatus}
                        minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                        searchableFields={searchableFields}
                        error={error}
                        ready={ready}
                    />
                )}
            </>
        </OrgUnitFetcher>
    );
};

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(MainPageContainer));
