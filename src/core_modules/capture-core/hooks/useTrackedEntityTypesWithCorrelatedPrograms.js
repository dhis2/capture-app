// @flow
import { useMemo } from 'react';
import type { TrackedEntityTypesWithCorrelatedPrograms } from '../components/Pages/Search/SearchPage.types';
import { programCollection } from '../metaDataMemoryStores';
import { TrackerProgram } from '../metaData/Program';

export const useTrackedEntityTypesWithCorrelatedPrograms = (): TrackedEntityTypesWithCorrelatedPrograms =>
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
