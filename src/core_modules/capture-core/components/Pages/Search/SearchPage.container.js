// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import type { ComponentType } from 'react';
import { SearchPageComponent } from './SearchPage.component';
import type { AvailableSearchOptions, TrackedEntityTypesWithCorrelatedPrograms } from './SearchPage.types';
import { navigateToMainPage, showInitialViewOnSearchPage } from './SearchPage.actions';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData';
import { searchScopes } from './SearchPage.constants';

const buildSearchOption = (id, name, searchGroups, searchScope) => ({
    searchOptionId: id,
    searchOptionName: name,
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

const useTrackedEntityTypesWithCorrelatedPrograms = (): TrackedEntityTypesWithCorrelatedPrograms =>
    useMemo(() =>
        [...programCollection.values()]
            .filter(program => program instanceof TrackerProgram)
            // $FlowFixMe
            .reduce((acc, {
                id: programId,
                name: programName,
                trackedEntityType: {
                    id: trackedEntityTypeId,
                    name: trackedEntityTypeName,
                    searchGroups: trackedEntityTypeSearchGroups,
                },
                searchGroups,
            }: TrackerProgram) => {
                const accumulatedProgramsOfTrackedEntityType =
            acc[trackedEntityTypeId] ? acc[trackedEntityTypeId].programs : [];
                return {
                    ...acc,
                    [trackedEntityTypeId]: {
                        trackedEntityTypeId,
                        trackedEntityTypeName,
                        trackedEntityTypeSearchGroups,
                        programs: [
                            ...accumulatedProgramsOfTrackedEntityType,
                            { programId, programName, searchGroups },
                        ],

                    },
                };
            }, {}),
    [],
    );

const useSearchOptions = (trackedEntityTypesWithCorrelatedPrograms): AvailableSearchOptions =>
    useMemo(() =>
        Object.values(trackedEntityTypesWithCorrelatedPrograms)
            // $FlowFixMe https://github.com/facebook/flow/issues/2221
            .reduce((acc, { trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, programs }) => ({
                ...acc,
                [trackedEntityTypeId]:
            buildSearchOption(
                trackedEntityTypeId,
                trackedEntityTypeName,
                trackedEntityTypeSearchGroups,
                searchScopes.TRACKED_ENTITY_TYPE,
            ),
                ...programs.reduce((accumulated, { programId, programName, searchGroups }) => ({
                    ...accumulated,
                    [programId]:
                buildSearchOption(
                    programId,
                    programName,
                    searchGroups,
                    searchScopes.PROGRAM,
                ),
                }), {}),
            }), {}),
    [trackedEntityTypesWithCorrelatedPrograms],
    );

const usePreselectedProgram = (trackedEntityTypesWithCorrelatedPrograms) => {
    const currentSelectionsId =
      useSelector(({ currentSelections }) => currentSelections.programId);

    return useMemo(() => {
        const preselection =
          Object.values(trackedEntityTypesWithCorrelatedPrograms)
              // $FlowFixMe https://github.com/facebook/flow/issues/2221
              .map(({ programs }) =>
                  programs.find(({ programId }) => programId === currentSelectionsId))
              .filter(program => program)[0];

        return {
            value: preselection && preselection.programId,
            label: preselection && preselection.programName,
        };
    }, [currentSelectionsId, trackedEntityTypesWithCorrelatedPrograms],
    );
};


export const SearchPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();

    const dispatchShowInitialSearchPage = useCallback(
        () => { dispatch(showInitialViewOnSearchPage()); },
        [dispatch]);
    const dispatchNavigateToMainPage = () => { dispatch(navigateToMainPage()); };

    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
    const availableSearchOptions = useSearchOptions(trackedEntityTypesWithCorrelatedPrograms);
    const preselectedProgram = usePreselectedProgram(trackedEntityTypesWithCorrelatedPrograms);

    const searchStatus: string =
      useSelector(({ searchPage }) => searchPage.searchStatus);
    const error: boolean =
      useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);
    const ready: boolean =
      useSelector(({ activePage }) => !activePage.isLoading);


    return (
        <SearchPageComponent
            navigateToMainPage={dispatchNavigateToMainPage}
            showInitialSearchPage={dispatchShowInitialSearchPage}
            trackedEntityTypesWithCorrelatedPrograms={trackedEntityTypesWithCorrelatedPrograms}
            availableSearchOptions={availableSearchOptions}
            preselectedProgram={preselectedProgram}
            searchStatus={searchStatus}
            error={error}
            ready={ready}
        />);
};
