// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useCategoryCombo = (programId) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        categoryCombo: {
            resource: 'programs',
            id: programId,
            params: {
                fields:
                ['categoryCombo[id,displayName,isDefault,categories[id,displayName]]'],
            },
        },
    }), [programId]));

    return {
        error,
        categoryCombo: !loading && data.categoryCombo?.categoryCombo,
    };
};
