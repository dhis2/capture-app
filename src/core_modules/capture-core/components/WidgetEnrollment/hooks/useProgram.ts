import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';

type ProgramData = {
    featureType: string;
    [key: string]: any;
};

const baseFields = [
    'displayIncidentDate,displayIncidentDateLabel,displayEnrollmentDateLabel,onlyEnrollOnce,' +
    'displayEnrollmentLabel,displayEventLabel,displayFollowUpLabel,displayOrgUnitLabel,' +
    'trackedEntityType[displayName,access],' +
    'programStages[autoGenerateEvent,name,access,id],' +
    'access,featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture',
];

const pluralFields = ['displayEventsLabel'];

const enrollmentAOCFields = [
    'enrollmentCategoryCombo[id,displayName,isDefault,categories[id,displayName],' +
    'categoryOptionCombos[id,categoryOptions[id]]]',
];

export const useProgram = (programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => {
                const fields = [...baseFields];
                if (featureAvailable(FEATURES.customTerminologyPlurals)) fields.push(...pluralFields);
                if (featureAvailable(FEATURES.enrollmentAOC)) fields.push(...enrollmentAOCFields);
                return {
                    program: {
                        resource: `programs/${programId}`,
                        params: { fields },
                    },
                };
            },
            [programId],
        ),
    );
    return { error, loading, program: data?.program as ProgramData | undefined };
};
