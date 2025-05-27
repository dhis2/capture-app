// @flow
import { getUserStorageController } from '../storageControllers';

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
