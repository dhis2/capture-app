// @flow
import { getAssociatedOrgUnitGroups } from 'capture-core/MetaDataStoreUtils/getAssociatedOrgUnitGroups';
import { getApi } from '../d2';

export async function getRulesEngineOrgUnit(orgUnitId: string) {
    return Promise.all([
        getApi().get(`organisationUnits/${orgUnitId}?fields=displayName,code`),
        getAssociatedOrgUnitGroups(orgUnitId),
    ]).then(([orgUnit, groups]) => ({
        id: orgUnitId,
        name: orgUnit.displayName,
        code: orgUnit.code,
        groups,
    }));
}
