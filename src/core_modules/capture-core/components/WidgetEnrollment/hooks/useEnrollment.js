// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useUpdateEnrollment } from './useUpdateEnrollment';

type Props = {
    enrollmentId: string,
    onUpdateEnrollmentDate?: (date: string) => void,
    onUpdateIncidentDate?: (date: string) => void,
    onError?: (error: any) => void,
    externalData?: {status: ?string, events?: ?Array<Object> },
}

export const useEnrollment = ({
    enrollmentId,
    onUpdateEnrollmentDate,
    onUpdateIncidentDate,
    onError,
    externalData,
}: Props) => {
    const [enrollment, setEnrollment] = useState();

    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                enrollment: {
                    resource: 'tracker/enrollments/',
                    id: ({ variables: { enrollmentId: updatedEnrollmentId } }) => updatedEnrollmentId,
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        enrollmentId && refetch({ variables: { enrollmentId } });
    }, [refetch, enrollmentId]);

    useEffect(() => {
        if (data) {
            if (externalData?.status) {
                setEnrollment({ ...data.enrollment, status: externalData.status });
            } else {
                setEnrollment(data.enrollment);
            }
        }
    }, [setEnrollment, data, externalData?.status]);

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
        updateEnrollmentDate,
        updateIncidentDate,
    };
};
