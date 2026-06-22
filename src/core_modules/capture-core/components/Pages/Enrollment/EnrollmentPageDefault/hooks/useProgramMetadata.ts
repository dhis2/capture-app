import { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useProgramFromIndexedDB } from '../../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useDataElementsFromIndexedDB } from '../../../../../utils/cachedDataHooks/useDataElementsFromIndexedDB';
import { useOptionSetsFromIndexedDB } from '../../../../../utils/cachedDataHooks/useOptionSetsFromIndexedDB';
import type { Program } from '../EnrollmentPageDefault.types';

const queryKey = 'useProgramMetadata';

// Exported for unit testing. Builds the enrollment-dashboard program metadata from the cached
// program and the data elements / option sets the current user is allowed to read. A data element
// referenced by a program stage is absent from `dataElementDictionary` when the user lacks metadata
// access to it (the program keeps the reference, but the data element query filters it out by
// sharing). Such data elements are omitted rather than dereferenced, which previously crashed the
// dashboard for non-superusers (DHIS2-21669).
export const buildProgramMetadata = (
    program: any,
    dataElementDictionary: { [id: string]: any },
    optionSetDictionary: { [id: string]: any },
): Program => ({
    programStages: program.programStages.map((stage: any) => ({
        id: stage.id,
        dataAccess: {
            read: stage.access.data.read,
            write: stage.access.data.write,
        },
        repeatable: stage.repeatable,
        hideDueDate: stage.hideDueDate,
        enableUserAssignment: stage.enableUserAssignment,
        programStageDataElements: stage.programStageDataElements
            .filter((programStageDataElement: any) => {
                const accessible = !!dataElementDictionary[programStageDataElement.dataElementId];
                if (!accessible) {
                    log.error(
                        errorCreator('data element missing from metadata store, likely no user access; omitting it')(
                            { dataElementId: programStageDataElement.dataElementId },
                        ),
                    );
                }
                return accessible;
            })
            .map((programStageDataElement: any) => {
                const dataElement = dataElementDictionary[programStageDataElement.dataElementId];
                return {
                    displayInReports: programStageDataElement.displayInReports,
                    dataElement: {
                        id: dataElement.id,
                        valueType: dataElement.valueType,
                        displayName: dataElement.displayName,
                        displayFormName: dataElement.displayFormName,
                        optionSet: dataElement.optionSetValue ? optionSetDictionary[dataElement.optionSet.id] : {},
                    },
                };
            }),
    })),
});

export const useProgramMetadata = (programId: string) => {
    const { program, isLoading, isError } = useProgramFromIndexedDB(programId, { enabled: !!programId });

    const dataElementIds = useMemo(() =>
        (program ? program.programStages.reduce(
            (acc, stage) => stage.programStageDataElements.reduce(
                (accIds, dataElement) => {
                    accIds.add(dataElement.dataElementId);
                    return accIds;
                }, acc),
            new Set) : undefined), [program]);

    const {
        isLoading: loadingDataElements,
        dataElements,
        isError: dataElementsError,
    } = useDataElementsFromIndexedDB([queryKey, programId], dataElementIds);

    const derivedDataElementValues = useMemo(() =>
        (dataElements ? ({
            optionSetIds: dataElements.reduce((acc, dataElement) => {
                if (dataElement.optionSetValue) {
                    acc.add(dataElement.optionSet.id);
                }
                return acc;
            }, new Set),
            dataElementDictionary: dataElements.reduce((acc: any, dataElement) => {
                acc[dataElement.id] = dataElement;
                return acc;
            }, {}),
        }) : undefined), [dataElements]);

    const {
        isLoading: loadingOptionSets,
        optionSets,
        isError: optionSetsError,
    } = useOptionSetsFromIndexedDB([queryKey, programId], derivedDataElementValues?.optionSetIds as any);

    const optionSetDictionary = useMemo(
        () => (optionSets ? optionSets.reduce(
            (acc: any, optionSet) => {
                acc[optionSet.id] = {
                    options: optionSet.options.map(option => ({
                        name: option.displayName,
                        code: option.code,
                    })),
                };
                return acc;
            }, {}) : undefined),
        [optionSets],
    );

    const programMetadata: Program | undefined = useMemo(() => {
        if (!program || !derivedDataElementValues || !optionSetDictionary) {
            return undefined;
        }

        return buildProgramMetadata(program, derivedDataElementValues.dataElementDictionary, optionSetDictionary);
    }, [program, derivedDataElementValues, optionSetDictionary]);


    return {
        error: (isError || dataElementsError || optionSetsError) && { programId },
        programMetadata: (isLoading || loadingDataElements || loadingOptionSets) ? undefined : programMetadata,
    };
};
