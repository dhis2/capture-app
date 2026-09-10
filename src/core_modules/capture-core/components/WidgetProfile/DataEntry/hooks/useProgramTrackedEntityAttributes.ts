import { useMemo } from 'react';

const processProgramTrackedEntityAttributes = (programAPI: any) =>
    programAPI?.programTrackedEntityAttributes?.reduce(
        (acc: any, currentValue: any) => ({
            ...acc,
            [currentValue.trackedEntityAttribute.id]: {
                ...currentValue.trackedEntityAttribute,
                optionSetId: currentValue.trackedEntityAttribute?.optionSet?.id,
            },
        }),
        {},
    );

export const useProgramTrackedEntityAttributes = (programAPI: any) =>
    useMemo(() => processProgramTrackedEntityAttributes(programAPI), [programAPI]);
