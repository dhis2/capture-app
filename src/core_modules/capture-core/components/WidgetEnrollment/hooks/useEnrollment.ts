import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { FEATURES, useFeature } from 'capture-core-utils/featuresSupport';
import { useUpdateEnrollment } from './useUpdateEnrollment';
import type { Enrollment } from '../enrollment.types';

const baseFields = [
    'enrollment',
    'trackedEntity',
    'program',
    'status',
    'orgUnit',
    'enrolledAt',
    'occurredAt',
    'followUp',
    'deleted',
    'updatedAt',
    'geometry',
];

const enrollmentAOCFields = ['attributeOptionCombo'];

type Props = {
    enrollmentId: string;
    onUpdateEnrollmentDate?: (date: string) => void;
    onUpdateIncidentDate?: (date: string) => void;
    onError?: (error: any) => void;
    externalData?: { status: { value: string | null }; events?: Array<Record<string, unknown>> | null };
};

export const useEnrollment = ({
    enrollmentId,
    onUpdateEnrollmentDate,
    onUpdateIncidentDate,
    onError,
    externalData,
}: Props) => {
    const [enrollment, setEnrollment] = useState<Enrollment | undefined>();
    const enrollmentAOCSupported = useFeature(FEATURES.enrollmentAOC);

    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => {
                const fields = [...baseFields];
                if (enrollmentAOCSupported) fields.push(...enrollmentAOCFields);
                return {
                    enrollment: {
                        resource: 'tracker/enrollments/',
                        id: ({ variables: { enrollmentId: updatedEnrollmentId } }: any) => updatedEnrollmentId,
                        params: { fields },
                    },
                };
            },
            [enrollmentAOCSupported],
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

    return {
        error,
        refetch,
        enrollment: !loading ? enrollment : null,
        setEnrollment,
        updateEnrollmentDate,
        updateIncidentDate,
    };
};
