// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useScheduleConfigFromProgram = (programId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        programConfig: {
            resource: 'programs',
            id: programId,
            params: {
                fields: ['displayIncidentDate'],
            },
        },
    }), [programId]));


    return { error, programConfig: !loading && data?.programConfig };
};
