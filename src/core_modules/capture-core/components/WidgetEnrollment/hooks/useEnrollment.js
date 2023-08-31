// @flow
import { useMemo, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

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

    useEffect(() => {
        enrollmentId && refetch({ variables: { enrollmentId } });
    }, [refetch, enrollmentId]);

    return { error, refetch, enrollment: !loading && data?.enrollment };
};
