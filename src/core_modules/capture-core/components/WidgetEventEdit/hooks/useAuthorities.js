// @flow
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

const auth = Object.freeze({
    F_UNCOMPLETE_EVENT: 'F_UNCOMPLETE_EVENT',
    ALL: 'ALL',
});

export const useAuthorities = () => {
    const queryKey = ['authorities'];
    const queryFn = {
        resource: 'me.json',
        params: {
            fields: 'authorities',
        },
    };
    const queryOptions = {
        select: ({ authorities }) =>
            authorities &&
            authorities.some(authority => authority === auth.ALL || authority === auth.F_UNCOMPLETE_EVENT),
    };
    const { data } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

    return {
        canEditCompletedEvent: Boolean(data),
    };
};
