// @flow
import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

export const useUserAvatar = (userId?: string) => {
    const queryKey = ['users', ...(userId ? [userId] : [])];
    const queryFn = {
        resource: 'users',
        id: userId,
        params: {
            fields: 'avatar',
        },
    };
    const queryOptions = { enabled: Boolean(userId) };
    const { data, isLoading } = useApiMetadataQuery<any>(queryKey, queryFn, queryOptions);

    return {
        avatarId: data?.avatar?.id,
        isLoading,
    };
};
