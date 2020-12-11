// @flow
import constantsStore from '../../metaDataMemoryStores/constants/constants.store';
import { getUserStorageController } from '../../storageControllers';

async function getConstants(storeName: string) {
  const storageController = getUserStorageController();
  return storageController.getAll(storeName);
}

export default async function buildConstants(storeName: string) {
  const storeConstants = await getConstants(storeName);
  constantsStore.set(storeConstants);
}
