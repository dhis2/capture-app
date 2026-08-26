import { constantsStore } from '../../metaDataMemoryStores/constants/constants.store';
import { getUserMetadataStorageController } from '../../storageControllers';

async function getConstants(storeName: string) {
    const storageController = getUserMetadataStorageController();
    return storageController.getAll(storeName);
}

export async function buildConstants(storeName: string) {
    const storeConstants = await getConstants(storeName);
    constantsStore.set(storeConstants);
}
