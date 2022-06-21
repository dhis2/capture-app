// @flow
import { getAssociatedOrgUnitGroups } from 'capture-core/MetaDataStoreUtils/getAssociatedOrgUnitGroups';
import type { QuerySingleResource } from '../utils/api/api.types';

export async function getRulesEngineOrgUnit(orgUnitId: string, querySingleResource: QuerySingleResource) {
    return Promise.all([
        querySingleResource({
            resource: `organisationUnits/${orgUnitId}`,
            params: {
                fields: 'displayName,code',
            },
        }),
        getAssociatedOrgUnitGroups(orgUnitId),
    ]).then(([orgUnit, groups]) => ({
        id: orgUnitId,
        name: orgUnit.displayName,
        code: orgUnit.code,
        groups,
    }));
}
