// @flow
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
        () => (
            !loading
            && data
            && data.userData
            && data.userData.userCredentials
            && data.userData.userCredentials.userRoles.map(({ id }) => id)
        ),
        [loading, data],
    );
    return { error, loading, userRoles };
};
