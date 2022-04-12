// @flow
import { useMemo } from 'react';
import type { AvailableSearchOptions } from './SearchPage.types';
import { searchScopes } from './SearchPage.constants';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';

const buildSearchOption = (id, name, searchGroups, searchScope, type) => ({
    searchOptionId: id,
    searchOptionName: name,
    TETypeName: type,
    searchGroups: [...searchGroups.values()].map(({ unique, searchForm, minAttributesRequiredToSearch }, index) => ({
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

export const useSearchOptions = (): AvailableSearchOptions => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
    return useMemo(
        () =>
            Object.values(trackedEntityTypesWithCorrelatedPrograms)
                .reduce(
                    // $FlowFixMe https://github.com/facebook/flow/issues/2221
                    (acc, { trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, programs }) => ({
                        ...acc,
                        [trackedEntityTypeId]: buildSearchOption(
                            trackedEntityTypeId,
                            trackedEntityTypeName,
                            trackedEntityTypeSearchGroups,
                            searchScopes.TRACKED_ENTITY_TYPE,
                        ),

                        ...programs.reduce(
                            (accumulated, { programId, programName, searchGroups }) => ({
                                ...accumulated,
                                [programId]: buildSearchOption(
                                    programId,
                                    programName,
                                    searchGroups,
                                    searchScopes.PROGRAM,
                                    trackedEntityTypeName,
                                ),
                            }),
                            {},
                        ),
                    }),
                    {},
                ),
        [trackedEntityTypesWithCorrelatedPrograms],
    );
};
