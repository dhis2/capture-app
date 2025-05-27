// @flow
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../../../storageControllers';

export const getTrackedEntityTypeById = (tetId: string) => {
    const storageController = getUserMetadataStorageController();
    return storageController.get(USER_METADATA_STORES.TRACKED_ENTITY_TYPES, tetId);
};
