// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo, useEffect } from 'react';
import type { ComponentType } from 'react';
import { SearchPageComponent } from './SearchPage.component';
import type { AvailableSearchOptions } from './SearchPage.types';
import { cleanSearchRelatedData, navigateToMainPage, showInitialViewOnSearchPage } from './SearchPage.actions';
import { searchScopes } from './SearchPage.constants';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { useCurrentTrackedEntityTypeId } from '../../../hooks/useCurrentTrackedEntityTypeId';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';

const buildSearchOption = (id, name, searchGroups, searchScope, type) => ({
    searchOptionId: id,
    searchOptionName: name,
    TETypeName: type,
    searchGroups: [...searchGroups.values()]
        .map(({ unique, searchForm, minAttributesRequiredToSearch }, index) => ({
            unique,
            searchForm,
            // We adding the `formId` here for the reason that we will use it in the SearchPage component.
            // Specifically the function `addFormData` will add an object for each input field to the store.
            // Also the formId is passed in the `Form` component and needs to be identical with the one in
            // the store in order for the `Form` to function. For these reasons we generate it once here.
            formId: `searchPageForm-${id}-${index}`,
            searchScope,
            minAttributesRequiredToSearch,
        })),
});

const useSearchOptions = (): AvailableSearchOptions => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
    return useMemo(() =>
        Object.values(trackedEntityTypesWithCorrelatedPrograms)
            // $FlowFixMe https://github.com/facebook/flow/issues/2221
            .reduce((acc, { trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, programs }) => ({
                ...acc,
                [trackedEntityTypeId]:
                  buildSearchOption(trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, searchScopes.TRACKED_ENTITY_TYPE),

                ...programs.reduce((accumulated, { programId, programName, searchGroups }) => ({
                    ...accumulated,
                    [programId]:
                      buildSearchOption(programId, programName, searchGroups, searchScopes.PROGRAM, trackedEntityTypeName),
                }), {}),
            }), {}),
    [trackedEntityTypesWithCorrelatedPrograms],
    );
};

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
