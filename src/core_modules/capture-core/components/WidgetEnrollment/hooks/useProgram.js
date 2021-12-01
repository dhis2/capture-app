// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export const useProgram = (programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                program: {
                    resource: `programs/${programId}`,
                    params: {
                        fields: [
                            'displayIncidentDate,incidentDateLabel,enrollmentDateLabel',
                        ],
                    },
                },
            }),
            [programId],
        ),
    );
    return { error, program: !loading && data?.program };
};
