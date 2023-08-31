// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import type { EnrollmentData } from '../enrollment.types';

export const useEnrollment = (enrollmentId: string) => {
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

    const [enrollment, setEnrollment] = useState<?EnrollmentData>();

    useEffect(() => {
        if (data) {
            setEnrollment(data.enrollment);
        }
    }, [setEnrollment, data]);

    useEffect(() => {
        enrollmentId && refetch({ variables: { enrollmentId } });
    }, [refetch, enrollmentId]);

    return { error, refetch, enrollment: !loading && enrollment, setEnrollment };
};
