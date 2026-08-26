import { useMemo } from 'react';
import { convertServerToClient } from '../../../../converters';

const getOptionSets = (array: any) =>
    array &&
    Object.values(array)?.reduce((acc: any, currentValue: any) => {
        const { optionSet } = currentValue;
        if (optionSet) {
            const { valueType, options, id } = optionSet;
            return {
                ...acc,
                [id]: {
                    ...optionSet,
                    options: options.map((option: any) => ({
                        ...option,
                        code: convertServerToClient(option.code, valueType),
                    })),
                },
            };
        }
        return acc;
    }, {});

export const useOptionSets = (programTrackedEntityAttributes: any, dataElements: any) =>
    useMemo(
        () => ({ ...getOptionSets(programTrackedEntityAttributes), ...getOptionSets(dataElements) }),
        [programTrackedEntityAttributes, dataElements],
    );
