// @flow
import { useEffect } from 'react';
import { useApiMetadataQuery } from '../../../utils/reactQueryHelpers';

export const useOrgUnitAutoSelect = (setRelatedStageDataValues: any) => {
    const queryKey = ['organisationUnits'];
    const queryFn = {
        resource: 'organisationUnits',
        params: {
            fields: 'id,path,displayName,children::isNotEmpty',
            withinUserSearchHierarchy: true,
            paging: 2,
        },
    };
    const { data, isLoading } = useApiMetadataQuery(queryKey, queryFn);

    useEffect(() => {
        const orgUnits = data?.organisationUnits;
        if (isLoading || !orgUnits || orgUnits.length !== 1) return;

        const [orgUnit] = orgUnits;
        if (orgUnit && !orgUnit.children) {
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
