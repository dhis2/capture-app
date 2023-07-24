// @flow
import { getUserStorageController } from '../../../../../../storageControllers';
import { userStores } from '../../../../../../storageControllers/stores';

export const getTrackedEntityTypeById = (tetId: string) => {
    const storageController = getUserStorageController();
    return storageController.get(userStores.TRACKED_ENTITY_TYPES, tetId);
};
