// @flow
import { getUserStorageController } from '../../storageControllers';
import { constantsStore } from '../../metaDataMemoryStores/constants/constants.store';

async function getConstants(storeName: string) {
    const storageController = getUserStorageController();
    return storageController.getAll(storeName);
}

export async function buildConstants(storeName: string) {
    const storeConstants = await getConstants(storeName);
    constantsStore.set(storeConstants);
}
