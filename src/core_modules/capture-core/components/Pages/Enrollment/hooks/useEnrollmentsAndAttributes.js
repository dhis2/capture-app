// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEnrollmentsAndAttributes = (teiId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        teiAttributes: {
            resource: 'trackedEntityInstances',
            id: teiId,
            params: { fields: ['enrollments[*],attributes'] },
        },
    }), [teiId]));


    return { error,
        enrollments: !loading && data?.teiAttributes?.enrollments,
        attributes: !loading && data?.teiAttributes?.attributes,
    };
};
