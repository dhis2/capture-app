// @flow
import { getUserStorageController } from 'capture-core/storageControllers';
import { getApi } from '../d2';

export async function getAssociatedOrgUnitGroups(orgUnitId: string): any {
    const storageController = getUserStorageController();
    const orgUnitGroups = await storageController.getAll(
        'organisationUnitGroups', {
            project: item => ({ id: item.id, code: item.code }),
            onIDBGetRequest: source => source
                .index('organisationUnitId')
                .openCursor(window.IDBKeyRange.only(orgUnitId)),
        },
    );
    return orgUnitGroups;
}

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
