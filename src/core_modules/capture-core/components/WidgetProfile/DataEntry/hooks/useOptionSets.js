// @flow
import { useMemo } from 'react';
import type { TrackedEntityAttributes, DataElements } from 'capture-core-utils/rulesEngine';

const getOptionSets = array =>
    array &&
    Object.values(array)?.reduce(
        (acc, currentValue) =>
            // $FlowFixMe[incompatible-type]
            (currentValue.optionSet ? { ...acc, [currentValue.optionSet.id]: currentValue.optionSet } : acc),
        {},
    );

export const useOptionSets = (programTrackedEntityAttributes: TrackedEntityAttributes, dataElements: DataElements) =>
    useMemo(
        () => ({ ...getOptionSets(programTrackedEntityAttributes), ...getOptionSets(dataElements) }),
        [programTrackedEntityAttributes, dataElements],
    );
