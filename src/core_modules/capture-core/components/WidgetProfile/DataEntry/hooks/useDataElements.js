// @flow
import { useMemo } from 'react';

const getDataElement = programStageDataElements =>
    programStageDataElements.reduce(
        (acc, current) => ({
            ...acc,
            [current.dataElement.id]: {
                displayInReports: current.displayInReports,
                displayInList: current.displayInList,
                displayInForms: current.displayInForms,
                compulsory: current.compulsory,
                ...current.dataElement,
            },
        }),
        {},
    );

const getDataElementsInProgram = program =>
    [...program.programStages.values()]
        // $FlowFixMe
        .reduce(
            (acc, current) => ({
                ...acc,
                ...getDataElement(current.programStageDataElements),
            }),
            {},
        );

export const useDataElements = (program: any) => useMemo(() => program && program.programStages && getDataElementsInProgram(program), [program]);
