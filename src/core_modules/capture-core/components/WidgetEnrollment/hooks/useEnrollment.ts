import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';
import { useUpdateEnrollment } from './useUpdateEnrollment';
import { useUpdateEnrollmentAOC } from './useUpdateEnrollmentAOC';
import type { Enrollment, EnrollmentCategoryCombo } from '../enrollment.types';

const baseFields = [
    'enrollment,trackedEntity,program,status,orgUnit,enrolledAt,' +
    'occurredAt,followUp,deleted,updatedAt,geometry',
];

const enrollmentAOCFields = ['attributeOptionCombo'];

type Props = {
    enrollmentId: string;
    enrollmentCategoryCombo?: EnrollmentCategoryCombo;
    program?: Record<string, unknown>;
    onUpdateEnrollmentDate?: (date: string) => void;
    onUpdateIncidentDate?: (date: string) => void;
    onError?: (error: any) => void;
    onSuccess?: () => void;
    externalData?: { status: { value: string | null }; events?: Array<Record<string, unknown>> | null };
};

export const useEnrollment = ({
    enrollmentId,
    enrollmentCategoryCombo,
    program,
    onUpdateEnrollmentDate,
    onUpdateIncidentDate,
    onError,
    onSuccess,
    externalData,
}: Props) => {
    const [enrollment, setEnrollment] = useState<Enrollment | undefined>();

    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => {
                const fields = [...baseFields];
                if (featureAvailable(FEATURES.enrollmentAOC)) fields.push(...enrollmentAOCFields);
                return {
                    enrollment: {
                        resource: 'tracker/enrollments/',
                        id: ({ variables: { enrollmentId: updatedEnrollmentId } }: any) => updatedEnrollmentId,
                        params: { fields },
                    },
                };
            },
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        enrollmentId && refetch({ variables: { enrollmentId } });
    }, [refetch, enrollmentId]);

    useEffect(() => {
        if (data) {
            setEnrollment((data as { enrollment: Enrollment }).enrollment);
        }
    }, [setEnrollment, data]);

    useEffect(() => {
        if (externalData?.status?.value) {
            setEnrollment(e => (e ? { ...e, status: externalData.status.value as string } : e));
        }
    }, [setEnrollment, externalData?.status]);

    const updateEnrollmentDate = useUpdateEnrollment({
        enrollment,
        setEnrollment,
        propertyName: 'enrolledAt',
        updateHandler: onUpdateEnrollmentDate,
        onError,
    });

    const updateIncidentDate = useUpdateEnrollment({
        enrollment,
        setEnrollment,
        propertyName: 'occurredAt',
        updateHandler: onUpdateIncidentDate,
        onError,
    });

    const { update: updateEnrollmentAOC, loading: savingEnrollmentAOC } = useUpdateEnrollmentAOC({
        enrollment,
        setEnrollment,
        enrollmentCategoryCombo,
        program,
        onError,
        onSuccess,
    });

    return {
        error,
        refetch,
        enrollment: !loading ? enrollment : null,
        updateEnrollmentDate,
        updateIncidentDate,
        updateEnrollmentAOC,
        savingEnrollmentAOC,
    };
};
