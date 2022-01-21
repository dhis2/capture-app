import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useRelationshipTypes = () => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        relationshipTypes: {
            resource: 'relationshipTypes',
        },
    }), []));

    return !loading && !error && data.relationshipTypes;
};
