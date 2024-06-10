// @flow
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

const auth = Object.freeze({
    F_TEI_CASCADE_DELETE: 'F_TEI_CASCADE_DELETE',
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
            authorities.some(authority => authority === auth.ALL || authority === auth.F_TEI_CASCADE_DELETE),
    };
    const { data } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

    return {
        canCascadeDeleteTei: Boolean(data),
    };
};
