// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEnrollment = (enrollmentId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                enrollment: {
                    resource: `enrollments/${enrollmentId}`,
                },
            }),
            [enrollmentId],
        ),
    );

    return { error, enrollment: !loading && data?.enrollment };
};
