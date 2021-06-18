// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEnrollmentsAndAttributes = (teiId: string, enrollmentId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        trackedEntityInstance: {
            resource: 'trackedEntityInstances',
            id: teiId,
            params: { fields: ['enrollments[*],attributes'] },
        },
    }), [teiId]));


    return { error,
        enrollment: !loading && data?.trackedEntityInstance?.enrollments
            .find(enrollment => enrollment.enrollment === enrollmentId),
        attributes: !loading && data?.trackedEntityInstance?.attributes,
    };
};
