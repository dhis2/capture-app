// @flow

import { useApiMetadataQuery } from '../reactQueryHelpers';

type Props = {
    authority: string,
}

export const useAuthority = ({ authority }: Props) => {
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
            authorities.some(apiAuthority => apiAuthority === 'ALL' || apiAuthority === authority),
    };
    const { data } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

    return {
        hasAuthority: Boolean(data),
    };
};
