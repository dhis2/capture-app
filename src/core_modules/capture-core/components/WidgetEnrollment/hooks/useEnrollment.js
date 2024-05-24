// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useUpdateEnrollment } from './useUpdateEnrollment';

type Props = {
    enrollmentId: string,
    onUpdateEnrollmentDate?: (date: string) => void,
    onUpdateIncidentDate?: (date: string) => void,
    onError?: (error: any) => void,
    externalData?: { status: { value: ?string }, events?: ?Array<Object> },
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
                    params: {
                        fields: 'enrollment,trackedEntity,program,status,orgUnit,enrolledAt,occurredAt,followUp,deleted,createdBy,updatedBy,geometry',
                    },
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
            setEnrollment(data.enrollment);
        }
    }, [setEnrollment, data]);

    useEffect(() => {
        if (externalData?.status?.value) {
            setEnrollment(e => ({ ...e, status: externalData?.status?.value }));
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
        updateEnrollmentDate,
        updateIncidentDate,
    };
};
