// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo, useEffect } from 'react';
import type { ComponentType } from 'react';
import { useLocationQuery } from '../../../utils/routing';
import { SearchPageComponent } from './SearchPage.component';
import { cleanSearchRelatedData, navigateToMainPage, navigateToNewUserPage, showInitialViewOnSearchPage } from './SearchPage.actions';
import {
    useSearchOptions,
    useTrackedEntityTypesWithCorrelatedPrograms,
    useCurrentTrackedEntityTypeId,
} from '../../../hooks';
import { TopBar } from './TopBar.container';
import { ResultsPageSizeContext } from '../shared-contexts';

const usePreselectedProgram = (currentSelectionsId): ?string => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();

    return useMemo(() => {
        const { programId } =
          Object.values(trackedEntityTypesWithCorrelatedPrograms)
              // $FlowFixMe https://github.com/facebook/flow/issues/2221
              .map(({ programs }) =>
                  programs.find(({ programId: currentProgramId }) => currentProgramId === currentSelectionsId))
              .filter(program => program)[0]
            || {};

        return programId;
    }, [currentSelectionsId, trackedEntityTypesWithCorrelatedPrograms],
    );
};


export const SearchPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();
    const { programId, orgUnitId } = useLocationQuery();

    const dispatchShowInitialSearchPage = useCallback(
        () => { dispatch(showInitialViewOnSearchPage()); },
        [dispatch]);
    const dispatchNavigateToMainPage = useCallback(
        () => { dispatch(navigateToMainPage()); },
        [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(
        () => { dispatch(cleanSearchRelatedData()); },
        [dispatch]);
    const dispatchNavigateToNewUserPage = useCallback(() => { dispatch(navigateToNewUserPage()); }, [dispatch]);


    const availableSearchOptions = useSearchOptions();
    const preselectedProgramId = usePreselectedProgram(programId);

    const searchStatus: string =
      useSelector(({ searchPage }) => searchPage.searchStatus);
    const error: boolean =
      useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);
    const ready: boolean =
      useSelector(({ activePage }) => !activePage.isLoading);

    const trackedEntityTypeId = useCurrentTrackedEntityTypeId();

    const { searchableFields, minAttributesRequiredToSearch } =
        useSelector(({ searchPage }) => searchPage);

    useEffect(() => {
        if (programId && (programId !== preselectedProgramId)) {
            // There is no search for Event type of programs.
            // In this case we navigate the users back to the main page
            dispatchNavigateToMainPage();
        }
    }, [programId, preselectedProgramId, dispatchNavigateToMainPage]);

    return (
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <TopBar programId={programId} orgUnitId={orgUnitId} />
            <SearchPageComponent
                navigateToMainPage={dispatchNavigateToMainPage}
                showInitialSearchPage={dispatchShowInitialSearchPage}
                cleanSearchRelatedInfo={dispatchCleanSearchRelatedData}
                navigateToRegisterUser={dispatchNavigateToNewUserPage}
                availableSearchOptions={availableSearchOptions}
                preselectedProgramId={preselectedProgramId}
                trackedEntityTypeId={trackedEntityTypeId}
                searchStatus={searchStatus}
                minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                searchableFields={searchableFields}
                error={error}
                ready={ready}
            />
        </ResultsPageSizeContext.Provider>
    );
};
