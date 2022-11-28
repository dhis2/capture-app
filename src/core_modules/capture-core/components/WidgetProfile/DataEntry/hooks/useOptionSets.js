// @flow
import { useMemo } from 'react';
import type { TrackedEntityAttributes, DataElements } from 'rules-engine';
import { convertServerToClient } from '../../../../converters';

const getOptionSets = array =>
    array &&
    Object.values(array)?.reduce((acc, currentValue) => {
        // $FlowFixMe[incompatible-use]
        const { optionSet } = currentValue;
        if (optionSet) {
            const { valueType, options, id } = optionSet;
            return {
                ...acc,
                [id]: {
                    ...optionSet,
                    options: options.map(option => ({
                        ...option,
                        code: convertServerToClient(option.code, valueType),
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
