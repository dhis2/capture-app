// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export const useEnrollment = (enrollmentId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                enrollment: {
                    resource: `enrollments/${enrollmentId}`,
                },
            }),
            [enrollmentId],
        ),
    );

    return { error, refetch, enrollment: !loading && data?.enrollment };
};
