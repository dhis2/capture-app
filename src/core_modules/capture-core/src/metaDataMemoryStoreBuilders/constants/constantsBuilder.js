// @flow
import constantsStore from '../../metaDataMemoryStores/constants/constants.store';
import getStorageContainer from '../../metaDataMemoryStores/storageContainer/metaDataStorageContainer';

async function getConstants(storeName: string) {
    const storageContainer = getStorageContainer();
    return storageContainer.getAll(storeName);
}

export default async function buildConstants(storeName: string) {
    const storeConstants = await getConstants(storeName);
    constantsStore.set(storeConstants);
}
