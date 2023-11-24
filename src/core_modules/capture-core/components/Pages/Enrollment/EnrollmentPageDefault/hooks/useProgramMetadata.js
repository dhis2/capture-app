// @flow
import { useMemo } from 'react';
import { useProgramFromIndexedDB } from '../../../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useDataElementsFromIndexedDB } from '../../../../../utils/cachedDataHooks/useDataElementsFromIndexedDB';
import { useOptionSetsFromIndexedDB } from '../../../../../utils/cachedDataHooks/useOptionSetsFromIndexedDB';

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
        loading: loadingDataElements,
        dataElements,
        error: dataElementsError,
    } = useDataElementsFromIndexedDB(dataElementIds);

    const derivedDataElementValues = useMemo(() =>
        (dataElements ? ({
            optionSetIds: dataElements.reduce((acc, dataElement) => {
                if (dataElement.optionSetValue) {
                    acc.add(dataElement.optionSet.id);
                }
                return acc;
            }, new Set),
            dataElementDictionary: dataElements.reduce((acc, dataElement) => {
                acc[dataElement.id] = dataElement;
                return acc;
            }, {}),
        }) : undefined), [dataElements]);

    const {
        loading: loadingOptionSets,
        optionSets,
        error: optionSetsError,
    } = useOptionSetsFromIndexedDB(derivedDataElementValues && derivedDataElementValues.optionSetIds);

    const optionSetDictionary = useMemo(
        () => (optionSets ? optionSets.reduce(
            (acc, optionSet) => {
                acc[optionSet.id] = {
                    optionSet: {
                        options: optionSet.options.map(option => ({
                            name: option.displayName,
                            code: option.code,
                        })),
                    },
                };
                return acc;
            }, {}) : undefined),
        [optionSets],
    );

    const programMetadata = useMemo(() => {
        if (!program || !derivedDataElementValues || !optionSetDictionary) {
            return undefined;
        }

        const dataElementDictionary = derivedDataElementValues.dataElementDictionary;

        return {
            programStages: program.programStages.map(stage => ({
                id: stage.id,
                repeatable: stage.repeatable,
                hideDueDate: stage.hideDueDate,
                enableUserAssignment: stage.enableUserAssignment,
                programStageDataElements: stage.programStageDataElements
                    .map((programStageDataElement) => {
                        const dataElement = dataElementDictionary[programStageDataElement.dataElementId];
                        const optionSet = dataElement.optionSetValue ? optionSetDictionary[dataElement.optionSet.id] : {};
                        return {
                            displayInReports: programStageDataElement.displayInReports,
                            dataElement: {
                                id: dataElement.id,
                                valueType: dataElement.valueType,
                                displayName: dataElement.displayName,
                                displayFormName: dataElement.displayFormName,
                                ...optionSet,
                            },
                        };
                    }),
            })),
        };
    }, [program, derivedDataElementValues, optionSetDictionary]);


    return {
        error: (isError || dataElementsError || optionSetsError) && { programId },
        programMetadata: (isLoading || loadingDataElements || loadingOptionSets) ? undefined : programMetadata,
    };
};
