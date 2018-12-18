// @flow
import optionSetsStore from '../../metaDataMemoryStores/optionSets/optionSets.store';
import { getUserStorageController } from '../../storageControllers';

function getOptionSets(storeName: string) {
    const storageController = getUserStorageController();
    return storageController.getAll(storeName);
}

export default async function buildOptionSets(storeName: string) {
    const storeOptionSets = await getOptionSets(storeName);
    optionSetsStore.set(storeOptionSets);
}
