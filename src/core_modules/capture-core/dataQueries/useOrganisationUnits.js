// @flow
import { useApiMetadataQuery } from '../utils/reactQueryHelpers';

export const useOrganisationUnits = (customQueryOptions: Object) => {
    const queryKey = ['organisationUnits'];
    const queryFn = {
        resource: 'organisationUnits',
        params: {
            fields: ['id, displayName~rename(name), path'],
            withinUserHierarchy: true,
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
