// @flow
import StorageContainer from 'capture-core-utils/storage/StorageController';

let currentStorageContainer;

export function set(storageContainer: StorageContainer) {
  currentStorageContainer = storageContainer;
}
export default () => currentStorageContainer;
