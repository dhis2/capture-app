// @flow

import { getUserStorageController } from '../../../../../../storageControllers';
import { userStores } from '../../../../../../storageControllers/stores';

export const getTrackedEntityAttributes = (attributeIds: Array<string>) => {
    const storageController = getUserStorageController();
    return storageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: attribute => attributeIds.includes(attribute.id),
    });
};
