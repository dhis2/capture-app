// @flow
import optionSetsStore from '../../metaDataMemoryStores/optionSets/optionSets.store';
import getStorageContainer from '../../metaDataMemoryStores/storageContainer/metaDataStorageContainer';

async function getOptionSets(storeName: string) {
    const storageContainer = getStorageContainer();
    return storageContainer.getAll(storeName);
}

export default async function buildOptionSets(storeName: string) {
    const storeOptionSets = await getOptionSets(storeName);
    optionSetsStore.set(storeOptionSets);
}
