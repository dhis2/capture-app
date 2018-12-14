// @flow
import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';

export default function getCommonPreRequisitesAsync(...stores: Array<string>) {
    const storageController = getStorageController();
    const storePromises = stores
        .map(store => storageController.getAll(store));
    return Promise
        .all(storePromises)
        .then(storesDataArray => storesDataArray.reduce((accStoresData, storeData, index) => {
            accStoresData[stores[index]] = storeData;
            return accStoresData;
        }, {}));
}
