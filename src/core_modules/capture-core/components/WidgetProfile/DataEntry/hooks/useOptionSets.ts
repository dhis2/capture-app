import { useMemo } from 'react';
import type { TrackedEntityAttributes, DataElements } from '../../../../rules/RuleEngine';
import { convertServerToClient } from '../../../../converters';

const getOptionSets = (array: Record<string, any> | null | undefined) =>
    array &&
    Object.values(array)?.reduce((acc, currentValue) => {
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

export const useOptionSets = (programTrackedEntityAttributes: TrackedEntityAttributes, dataElements: DataElements) =>
    useMemo(
        () => ({ ...getOptionSets(programTrackedEntityAttributes), ...getOptionSets(dataElements) }),
        [programTrackedEntityAttributes, dataElements],
    );
