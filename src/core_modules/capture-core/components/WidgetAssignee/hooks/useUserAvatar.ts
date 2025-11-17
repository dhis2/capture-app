import { useApiMetadataQuery } from 'capture-core/utils/reactQueryHelpers';

type UserAvatarResponse = {
    avatar?: {
        id: string;
    };
};

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
    const { data, isInitialLoading } = useApiMetadataQuery(queryKey, queryFn, queryOptions);

    return {
        avatarId: (data as UserAvatarResponse)?.avatar?.id,
        isLoading: isInitialLoading,
    };
};
