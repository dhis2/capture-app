// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTeiRelationship = (teiId: string) => {
    const teiRelationshipQuery = useMemo(() => ({
        teiRelationship: {
            resource: 'relationships',
            params: {
                tei: teiId,
            },
        },
    }), [teiId]);
    const {
        loading,
        data,
        error,
    } = useDataQuery(teiRelationshipQuery);

    return { error, teiRelationship: !loading && data?.teiRelationship };
};
