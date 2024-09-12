// @flow
import { useEffect } from 'react';
import { useApiMetadataQuery } from '../../../utils/reactQueryHelpers';

export const useOrgUnitAutoSelect = (setRelatedStageDataValues: any) => {
    const queryKey = ['organisationUnits'];
    const queryFn = {
        resource: 'organisationUnits',
        params: {
            fields: ['id, displayName~rename(name), path'],
            withinUserHierarchy: true,
            pageSize: 2,
        },
    };
    const { data, isLoading } = useApiMetadataQuery(queryKey, queryFn);

    useEffect(() => {
        if (!isLoading && data?.organisationUnits?.length === 1) {
            setRelatedStageDataValues(prev => ({
                ...prev,
                orgUnit: data.organisationUnits[0],
            }));
        }
    }, [data, isLoading, setRelatedStageDataValues]);

    return {
        isLoading,
    };
};
