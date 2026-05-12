import { useMemo } from 'react';
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

type ApiOptionSet = {
    id: string;
    displayName?: string;
    version?: number;
    valueType?: string;
    options?: Array<{
        id: string;
        displayName?: string;
        name?: string;
        code?: string;
        style?: any;
        translations?: any;
    }>;
};

type OptionSetDict = { [optionSetId: string]: ApiOptionSet };

const collectOptionSetIds = (program: any): string[] => {
    const ids = new Set<string>();

    program.programTrackedEntityAttributes?.forEach((attribute: any) => {
        const id = attribute?.trackedEntityAttribute?.optionSet?.id;
        if (id) ids.add(id);
    });

    program.programStages?.forEach((stage: any) => {
        stage.programStageDataElements?.forEach((psde: any) => {
            const id = psde?.dataElement?.optionSet?.id;
            if (id) ids.add(id);
        });
    });

    return [...ids];
};

const toDict = ({ optionSets = [] }: { optionSets?: ApiOptionSet[] }): OptionSetDict =>
    optionSets.reduce((acc: OptionSetDict, optionSet) => {
        acc[optionSet.id] = optionSet;
        return acc;
    }, {});

export const useOptionSets = (program: any) => {
    const optionSetIds = useMemo(() => (program ? collectOptionSetIds(program) : []), [program]);

    const queryKey = ['optionSets', 'programOptionSets', ...(program?.id ? [program.id] : [])];
    const queryFn = {
        resource: 'optionSets',
        params: {
            fields: 'id,displayName,version,valueType,'
                + 'options[id,displayName,name,code,style,translations]',
            filter: `id:in:[${optionSetIds.join(',')}]`,
            paging: false,
        },
    };
    const queryOptions = {
        enabled: Boolean(program) && optionSetIds.length > 0,
        select: toDict,
    };

    const { data, isInitialLoading, error } = useApiMetadataQuery<OptionSetDict>(queryKey, queryFn, queryOptions);

    let optionSets: OptionSetDict | null = null;
    if (program) {
        optionSets = optionSetIds.length === 0 ? {} : (data ?? null);
    }

    return {
        optionSets,
        loading: isInitialLoading,
        error,
    };
};
