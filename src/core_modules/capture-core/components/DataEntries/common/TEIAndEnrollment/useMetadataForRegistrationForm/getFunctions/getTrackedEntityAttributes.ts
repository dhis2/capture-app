import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../../../storageControllers';

export const getTrackedEntityAttributes = (attributeIds: Array<string>) => {
    const storageController = getUserMetadataStorageController();
    return storageController.getAll(USER_METADATA_STORES.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: attribute => attributeIds.includes(attribute.id),
    });
};
