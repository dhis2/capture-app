// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useSystemSettings = () => {
    const { error, data } = useDataQuery(
        useMemo(
            () => ({
                systemSettings: {
                    resource: 'system/info',
                    params: {
                        fields: ['serverTimeZoneId'],
                    },
                },
            }),
            [],
        ),
    );

    return { error, systemSettings: data?.systemSettings };
};
