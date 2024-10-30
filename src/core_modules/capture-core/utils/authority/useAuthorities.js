// @flow
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

const auth = Object.freeze({
    ALL: 'ALL',
});

export const useAuthorities = ({ authorities }: { authorities: Array<string> }) => {
    const queryKey = ['authorities'];
    const queryFn = {
        resource: 'me.json',
        params: {
            fields: 'authorities',
        },
    };
    const queryOptions = {
        select: ({ authorities: userAuthorities }) =>
            userAuthorities &&
            authorities.some(
                authority => userAuthorities.includes(auth.ALL) || userAuthorities.includes(authority),
            ),
    };
    const { data } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

    return {
        hasAuthority: Boolean(data),
    };
};
