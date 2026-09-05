import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type ProgramData = {
    featureType: string;
    [key: string]: any;
};

const fields = [
    'displayIncidentDate,displayIncidentDateLabel,displayEnrollmentDateLabel,onlyEnrollOnce,' +
    'displayEnrollmentLabel,displayFollowUpLabel,displayOrgUnitLabel,' +
    'displayRelationshipLabel,displayNoteLabel,displayTrackedEntityAttributeLabel,' +
    'displayProgramStageLabel,displayEventLabel,' +
    'trackedEntityType[displayName,access],' +
    'programStages[autoGenerateEvent,name,access,id],' +
    'access,featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture',
];

export const useProgram = (programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                program: {
                    resource: `programs/${programId}`,
                    params: { fields },
                },
            }),
            [programId],
        ),
    );
    return { error, loading, program: data?.program as ProgramData | undefined };
};
