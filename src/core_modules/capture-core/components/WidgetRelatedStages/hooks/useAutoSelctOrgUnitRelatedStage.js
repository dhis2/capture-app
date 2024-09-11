// @flow
import { useEffect } from 'react';
import { useApiMetadataQuery } from '../../../utils/reactQueryHelpers';

export const useOrgUnitAutoSelect = (setRelatedStageDataValues: any) => {
    const queryKey = ['organisationUnits'];
    const queryFn = {
        resource: 'organisationUnits',
        params: {
            fields: 'id,path,displayName',
            withinUserSearchHierarchy: true,
            page: 2,
        },
    };
    const { data, isLoading } = useApiMetadataQuery(queryKey, queryFn);

    useEffect(() => {
        if (!isLoading && data) {
            const orgUnits = data.organisationUnits;
            if (!orgUnits || orgUnits.length !== 1) return;
            const [orgUnit] = orgUnits;
            const { displayName, ...rest } = orgUnit;
            setRelatedStageDataValues(prev => ({
                ...prev,
                orgUnit: { ...rest, name: displayName },
            }));
        }
    }, [data, isLoading, setRelatedStageDataValues]);

    return {
        isLoading,
    };
};
