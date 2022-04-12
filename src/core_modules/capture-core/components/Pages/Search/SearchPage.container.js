// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo, useEffect } from 'react';
import type { ComponentType } from 'react';
import { SearchPageComponent } from './SearchPage.component';
import { cleanSearchRelatedData, navigateToMainPage, showInitialViewOnSearchPage } from './SearchPage.actions';
import { useSearchOptions } from './useSearchOptions';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { useCurrentTrackedEntityTypeId } from '../../../hooks/useCurrentTrackedEntityTypeId';

const usePreselectedProgram = (): ?string => {
    const currentSelectionsId =
      useSelector(({ currentSelections }) => currentSelections.programId);
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

    const dispatchShowInitialSearchPage = useCallback(
        () => { dispatch(showInitialViewOnSearchPage()); },
        [dispatch]);
    const dispatchNavigateToMainPage = useCallback(
        () => { dispatch(navigateToMainPage()); },
        [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(
        () => { dispatch(cleanSearchRelatedData()); },
        [dispatch]);

    const availableSearchOptions = useSearchOptions();
    const preselectedProgramId = usePreselectedProgram();

    const searchStatus: string =
      useSelector(({ searchPage }) => searchPage.searchStatus);
    const error: boolean =
      useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);
    const ready: boolean =
      useSelector(({ activePage }) => !activePage.isLoading);
    const currentProgramId: string =
      useSelector(({ currentSelections }) => currentSelections.programId);

    const trackedEntityTypeId = useCurrentTrackedEntityTypeId();

    useEffect(() => {
        if (currentProgramId && (currentProgramId !== preselectedProgramId)) {
            // There is no search for Event type of programs.
            // In this case we navigate the users back to the main page
            dispatchNavigateToMainPage();
        }
    }, [currentProgramId, preselectedProgramId, dispatchNavigateToMainPage]);

    return (
        <SearchPageComponent
            navigateToMainPage={dispatchNavigateToMainPage}
            showInitialSearchPage={dispatchShowInitialSearchPage}
            cleanSearchRelatedInfo={dispatchCleanSearchRelatedData}
            availableSearchOptions={availableSearchOptions}
            preselectedProgramId={preselectedProgramId}
            trackedEntityTypeId={trackedEntityTypeId}
            searchStatus={searchStatus}
            error={error}
            ready={ready}
        />);
};
