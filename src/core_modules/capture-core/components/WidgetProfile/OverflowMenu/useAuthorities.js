// @flow
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

export const useAuthorities = () => {
    const queryKey = ['authorities'];
    const queryFn = {
        resource: 'me.json',
        params: {
            fields: 'authorities',
        },
    };
    const { data } = useApiMetadataQuery<any>(queryKey, queryFn);

    return {
        authorities: data?.authorities || [],
    };
};
