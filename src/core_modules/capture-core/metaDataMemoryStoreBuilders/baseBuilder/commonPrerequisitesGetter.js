// @flow
import { getUserMetadataStorageController, typeof USER_METADATA_STORES } from '../../storageControllers';

function arrayToMap(array: Array<Object>) {
    return array.reduce((accMap, item) => {
        accMap.set(item.id, item);
        return accMap;
    }, new Map());
}

export function getCommonPrerequisitesAsync(...stores: Array<$Values<USER_METADATA_STORES>>): { [$Values<USER_METADATA_STORES>]: Map<string, any> } {
    const storageController = getUserMetadataStorageController();
    const storePromises = stores
        .map(store => storageController.getAll(store));
    return Promise
        .all(storePromises)
        .then(storesDataArray => storesDataArray.reduce((accStoresData, storeData, index) => {
            accStoresData[stores[index]] = arrayToMap(storeData);
            return accStoresData;
        }, {}));
}
