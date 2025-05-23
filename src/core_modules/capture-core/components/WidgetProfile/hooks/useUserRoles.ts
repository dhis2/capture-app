import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields = 'userCredentials[userRoles]';

export const useUserRoles = () => {
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
            if (!loading && data?.userData) {
                const userData = data.userData as {
                    userCredentials?: {
                        userRoles?: Array<{ id: string }>
                    }
                };
                return userData.userCredentials?.userRoles?.map(({ id }) => id);
            }
            return undefined;
        },
        [loading, data],
    );
    return { error, loading, userRoles };
};
