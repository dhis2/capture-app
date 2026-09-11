import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';
import type { Authority } from './authorities';

export const useAuthority = (authority: Authority) => {
    const { data } = useApiMetadataQuery(
        ['authorities'],
        { resource: 'me.json', params: { fields: 'authorities' } },
        {
            select: ({ authorities: userAuthorities }: { authorities: string[] }) =>
                userAuthorities?.includes('ALL') || userAuthorities?.includes(authority),
        },
    );
    return { hasAuthority: Boolean(data) };
};
