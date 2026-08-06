import { useApiMetadataQuery } from '../utils/reactQueryHelpers';

export type AutoSelectOrgUnit = {
    id: string;
    name: string;
    path: string;
};

type AutoSelectOrgUnitsResponse = {
    organisationUnits: Array<AutoSelectOrgUnit>;
};

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
        select: ({ organisationUnits }: AutoSelectOrgUnitsResponse) => organisationUnits,
    };

    const queryOptions = { ...defaultQueryOptions, ...customQueryOptions };

    const { data, isInitialLoading } = useApiMetadataQuery<AutoSelectOrgUnitsResponse, Array<AutoSelectOrgUnit>>(
        queryKey,
        queryFn,
        queryOptions,
    );

    return {
        isLoading: isInitialLoading,
        data,
    };
};
