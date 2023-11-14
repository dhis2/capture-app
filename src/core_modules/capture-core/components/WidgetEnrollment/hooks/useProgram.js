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
                            'displayIncidentDate,displayIncidentDateLabel,displayEnrollmentDateLabel,onlyEnrollOnce,trackedEntityType[displayName],programStages[autoGenerateEvent],access,featureType',
                        ],
                    },
                },
            }),
            [programId],
        ),
    );
    return { error, loading, program: data?.program };
};
