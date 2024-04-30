// @flow
import { useMemo } from 'react';
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

const createOptionSetToOptionGroupDictionary = ({ optionGroups }) => optionGroups.reduce(
    (acc, optionGroup) => {
        const optionSetId = optionGroup.optionSet.id;
        const transformedOptionGroup = {
            id: optionGroup.id,
            options: optionGroup.options.map(option => option.id),
        };
        if (acc[optionSetId]) {
            acc[optionSetId].push(transformedOptionGroup);
        } else {
            acc[optionSetId] = [transformedOptionGroup];
        }
        return acc;
    },
    {},
);

export const useOptionGroups = (program: any) => {
    const params = useMemo(() => {
        if (!program) {
            return {};
        }

        const attributes = program.programTrackedEntityAttributes.reduce(
            (acc, attribute) => {
                const optionSet = attribute.trackedEntityAttribute.optionSet;
                if (optionSet) {
                    acc.push(optionSet.id);
                }
                return acc;
            },
            [],
        );

        return {
            fields: 'id,optionSet,options',
            filter: `optionSet.id:in:[${attributes.join(',')}]`,
        };
    }, [program]);

    const queryKey = ['optionGroups', 'programAttributes', ...(program?.id ? [program.id] : [])];
    const queryFn = { resource: 'optionGroups', params };
    const queryOptions = {
        enabled: Boolean(program),
        select: createOptionSetToOptionGroupDictionary,
    };
    const { data, isLoading, error } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

    return {
        optionGroups: program ? data : null,
        loading: isLoading,
        error,
    };
};
