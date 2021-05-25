// @flow
import { getUserStorageController } from '../../storageControllers';
import { typeof userStores } from '../../storageControllers/stores';

function arrayToMap(array: Array<Object>) {
    return array.reduce((accMap, item) => {
        accMap.set(item.id, item);
        return accMap;
    }, new Map());
}

export function getCommonPrerequisitesAsync(...stores: Array<$Values<userStores>>): { [$Values<userStores>]: Map<string, any> } {
    const storageController = getUserStorageController();
    const storePromises = stores
        .map(store => storageController.getAll(store));
    return Promise
        .all(storePromises)
        .then(storesDataArray => storesDataArray.reduce((accStoresData, storeData, index) => {
            accStoresData[stores[index]] = arrayToMap(storeData);
            return accStoresData;
        }, {}));
}
