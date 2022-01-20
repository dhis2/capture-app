// @flow
import { useMemo } from 'react';

const processProgramTrackedEntityAttributes = (programAPI: any) =>
    programAPI?.programTrackedEntityAttributes?.reduce(
        (acc, currentValue) => ({
            ...acc,
            [currentValue.trackedEntityAttribute.id]: currentValue.trackedEntityAttribute,
        }),
        {},
    );

export const useProgramTrackedEntityAttributes = (programAPI: any) => useMemo(() => processProgramTrackedEntityAttributes(programAPI), [programAPI]);
