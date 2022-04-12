// @flow
import React, { useEffect, useMemo, useCallback } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import {
    SearchPageComponent,
    useSearchOptions,
    cleanSearchRelatedData,
    showInitialViewOnSearchPage,
} from '../Search';
import { MainPageComponent } from './MainPage.component';
import { updateShowAccessibleStatus } from '../actions/crossPage.actions';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { MainPageStatuses } from './MainPage.constants';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';

const showMainPage = (selectedProgram) => {
    const noProgramSelected = !selectedProgram;
    const isEventProgram = !selectedProgram?.trackedEntityType?.id;
    const displayFrontPageList = selectedProgram?.trackedEntityType?.id && selectedProgram?.displayFrontPageList;

    return noProgramSelected || isEventProgram || displayFrontPageList;
};

export const MainPage = () => {
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
            ready: !activePage.isLoading,
            error: activePage.selectionsError && activePage.selectionsError.error,
        }),
        shallowEqual,
    );
    const selectedProgram = programId && programCollection.get(programId);
    const trackedEntityTypeId = selectedProgram?.trackedEntityType?.id;

    const availableSearchOptions = useSearchOptions();
    const dispatchShowInitialSearchPage = useCallback(
        () => { dispatch(showInitialViewOnSearchPage()); }, [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(
        () => { dispatch(cleanSearchRelatedData()); }, [dispatch]);

    useEffect(() => {
        dispatch(updateShowAccessibleStatus(showAllAccessible));
    }, [showAllAccessible, dispatch]);

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
            <>
                {showMainPage(selectedProgram) ? (
                    <MainPageComponent
                        MainPageStatus={MainPageStatus}
                        programId={programId}
                        orgUnitId={orgUnitId}
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

