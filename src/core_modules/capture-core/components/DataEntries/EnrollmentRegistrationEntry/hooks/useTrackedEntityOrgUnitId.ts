import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';

export const useTrackedEntityOrgUnitId = (teiId?: string) => {
    const { data } = useApiDataQuery(
        ['trackedEntities', 'orgUnit', teiId],
        {
            resource: 'tracker/trackedEntities',
            id: teiId,
            params: {
                fields: ['orgUnit'],
            },
        },
        {
            enabled: !!teiId,
        },
    );

    return (data as any)?.orgUnit as string | undefined;
};
