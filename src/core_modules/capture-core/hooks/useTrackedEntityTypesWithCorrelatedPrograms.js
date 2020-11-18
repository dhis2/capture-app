// @flow
import { useMemo } from 'react';
import { programCollection } from '../metaDataMemoryStores';
import { TrackerProgram } from '../metaData/Program';

type TrackedEntityTypesWithCorrelatedPrograms = $ReadOnly<{
    [elementId: string]: {|
        +trackedEntityTypeId: string,
        +trackedEntityTypeName: string,
        +programs: Array<{|
            +programName: string,
            +programId: string,
        |}>
    |}
}>

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
