import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';

type ProgramData = {
    featureType: string;
    [key: string]: any;
};

const baseFields = [
    'displayIncidentDate,displayIncidentDateLabel,displayEnrollmentDateLabel,onlyEnrollOnce,' +
    'displayEnrollmentLabel,displayFollowUpLabel,displayOrgUnitLabel,' +
    'displayRelationshipLabel,displayNoteLabel,displayTrackedEntityAttributeLabel,' +
    'displayProgramStageLabel,displayEventLabel,' +
    'trackedEntityType[displayName,access],' +
    'programStages[autoGenerateEvent,name,access,id],' +
    'access,featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture',
];

const pluralFields = [
    'displayEnrollmentsLabel,displayProgramStagesLabel,displayEventsLabel',
];

export const useProgram = (programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                program: {
                    resource: `programs/${programId}`,
                    params: {
                        fields: featureAvailable(FEATURES.customTerminologyPlurals)
                            ? [...baseFields, ...pluralFields]
                            : baseFields,
                    },
                },
            }),
            [programId],
        ),
    );
    return { error, loading, program: data?.program as ProgramData | undefined };
};
