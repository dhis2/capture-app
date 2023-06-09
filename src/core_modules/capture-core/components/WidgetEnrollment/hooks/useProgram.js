// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useProgram = (programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                program: {
                    resource: `programs/${programId}`,
                    params: {
                        fields: [
                            'displayIncidentDate,incidentDateLabel,enrollmentDateLabel,onlyEnrollOnce,trackedEntityType[displayName],programStages[autoGenerateEvent],access',
                        ],
                    },
                },
            }),
            [programId],
        ),
    );
    return { error, program: !loading && data?.program };
};
