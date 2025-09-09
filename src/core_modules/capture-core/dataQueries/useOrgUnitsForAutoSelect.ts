import { useApiMetadataQuery } from '../utils/reactQueryHelpers';

export const useOrgUnitAutoSelect = (customQueryOptions: any = {}) => {
    const queryKey = ['organisationUnits'];
    const queryFn = {
        resource: 'organisationUnits',
        params: {
            fields: ['id, displayName~rename(name), path'],
            withinUserHierarchy: true,
            pageSize: 2,
        },
    };
    const defaultQueryOptions = {
        select: ({ organisationUnits }) => organisationUnits,
    };

    const queryOptions = { ...defaultQueryOptions, ...customQueryOptions };

    const { data, isLoading } = useApiMetadataQuery(queryKey, queryFn, queryOptions);

    return {
        isLoading,
        data,
    };
};
