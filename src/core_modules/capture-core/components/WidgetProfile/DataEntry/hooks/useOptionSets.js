// @flow
import { useMemo } from 'react';
import type { TrackedEntityAttributes, DataElements } from 'capture-core-utils/rulesEngine';
import { convertServerToClient } from '../../../../converters';

const getOptionSets = array =>
    array &&
    Object.values(array)?.reduce((acc, currentValue) => {
        // $FlowFixMe[incompatible-use]
        const { optionSet } = currentValue;
        if (optionSet) {
            const { valueType, displayName, options, id } = optionSet;
            return {
                ...acc,
                [id]: {
                    ...optionSet,
                    displayName: convertServerToClient(displayName, valueType),
                    options: options.map(option => ({
                        ...option,
                        code: convertServerToClient(option.code, valueType),
                        displayName: convertServerToClient(option.displayName, valueType),
                    })),
                },
            };
        }
        return acc;
    }, {});

export const useOptionSets = (programTrackedEntityAttributes: TrackedEntityAttributes, dataElements: DataElements) =>
    useMemo(
        () => ({ ...getOptionSets(programTrackedEntityAttributes), ...getOptionSets(dataElements) }),
        [programTrackedEntityAttributes, dataElements],
    );
