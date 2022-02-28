// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEnrollment = (enrollmentId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                enrollment: {
                    resource: `tracker/enrollments/${enrollmentId}`,
                },
            }),
            [enrollmentId],
        ),
    );

    return { error, refetch, enrollment: !loading && data?.enrollment };
};
