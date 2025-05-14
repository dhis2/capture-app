import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields = 'userCredentials[userRoles]';

type UserData = {
    userCredentials: {
        userRoles: Array<{ id: string }>;
    };
};

type UserRolesReturnType = {
    error?: any;
    loading: boolean;
    userRoles?: string[];
};

export const useUserRoles = (): UserRolesReturnType => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                userData: {
                    resource: 'me.json',
                    params: {
                        fields,
                    },
                },
            }),
            [],
        ),
    );

    const userRoles = useMemo(
        () => {
            if (!loading && data && data.userData) {
                const userData = data.userData as UserData;
                if (userData.userCredentials && userData.userCredentials.userRoles) {
                    return userData.userCredentials.userRoles.map(({ id }) => id);
                }
            }
            return undefined;
        },
        [loading, data],
    );
    return { error, loading, userRoles };
};
