// @flow
import optionSetsStore from '../../metaDataMemoryStores/optionSets/optionSets.store';
import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';

async function getOptionSets(storeName: string) {
    const storageController = getStorageController();
    return storageController.getAll(storeName);
}

export default async function buildOptionSets(storeName: string) {
    const storeOptionSets = await getOptionSets(storeName);
    optionSetsStore.set(storeOptionSets);
}
