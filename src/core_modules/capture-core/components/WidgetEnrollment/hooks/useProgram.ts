import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type ProgramData = {
    featureType: string;
    displayIncidentDate: boolean;
    displayIncidentDateLabel: string;
    displayEnrollmentDateLabel: string;
    onlyEnrollOnce: boolean;
    trackedEntityType: {
        displayName: string;
        access: Record<string, any>;
    };
    programStages: Array<{
        autoGenerateEvent: boolean;
        name: string;
        access: Record<string, any>;
        id: string;
    }>;
    access: Record<string, any>;
    selectEnrollmentDatesInFuture: boolean;
    selectIncidentDatesInFuture: boolean;
};

export const useProgram = (programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                program: {
                    resource: `programs/${programId}`,
                    params: {
                        fields: [
                            'displayIncidentDate,displayIncidentDateLabel,displayEnrollmentDateLabel,onlyEnrollOnce,trackedEntityType[displayName,access],programStages[autoGenerateEvent,name,access,id],access,featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture',
                        ],
                    },
                },
            }),
            [programId],
        ),
    );
    return { error, loading, program: data?.program as ProgramData };
};
