import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../storageControllers';

function arrayToMap(array: any[]) {
    return array.reduce((accMap, item) => {
        accMap.set(item.id, item);
        return accMap;
    }, new Map());
}

export function getCommonPrerequisitesAsync(...stores: Array<keyof typeof USER_METADATA_STORES>): Promise<any> {
    const storageController = getUserMetadataStorageController();
    const storePromises = stores
        .map(store => storageController.getAll(store));
    return Promise
        .all(storePromises)
        .then(storesDataArray => storesDataArray.reduce((accStoresData, storeData, index) => {
            (accStoresData as any)[stores[index]] = arrayToMap(storeData);
            return accStoresData;
        }, {} as any));
}
