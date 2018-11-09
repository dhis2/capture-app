// @flow
import constantsStore from '../../metaDataMemoryStores/constants/constants.store';
import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';

async function getConstants(storeName: string) {
    const storageController = getStorageController();
    return storageController.getAll(storeName);
}

export default async function buildConstants(storeName: string) {
    const storeConstants = await getConstants(storeName);
    constantsStore.set(storeConstants);
}
