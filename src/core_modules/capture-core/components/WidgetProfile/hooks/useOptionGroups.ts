import { useMemo } from 'react';
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

type OptionGroup = {
    id: string;
    optionSet: {
        id: string;
    };
    options: Array<{ id: string }>;
};

type OptionGroupsData = {
    optionGroups: OptionGroup[];
};

type TransformedOptionGroup = {
    id: string;
    options: string[];
};

type OptionSetDictionary = {
    [optionSetId: string]: TransformedOptionGroup[];
};

type OptionGroupsReturnType = {
    optionGroups: OptionSetDictionary | null;
    loading: boolean;
    error?: any;
};

const createOptionSetToOptionGroupDictionary = ({ optionGroups }: OptionGroupsData): OptionSetDictionary => optionGroups.reduce(
    (acc: OptionSetDictionary, optionGroup: OptionGroup) => {
        const optionSetId = optionGroup.optionSet.id;
        const transformedOptionGroup: TransformedOptionGroup = {
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

export const useOptionGroups = (program: any): OptionGroupsReturnType => {
    const params = useMemo(() => {
        if (!program) {
            return {};
        }

        const attributes = program.programTrackedEntityAttributes.reduce(
            (acc: string[], attribute: any) => {
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
    const { data, isLoading, error } = useApiMetadataQuery(queryKey, queryFn, queryOptions);

    return {
        optionGroups: program ? (data as OptionSetDictionary) : null,
        loading: isLoading,
        error,
    };
};
