// @flow
import StorageContainer from 'd2-tracker/storage/StorageContainer';

let currentStorageContainer;

export function set(storageContainer: StorageContainer) {
    currentStorageContainer = storageContainer;
}
export default () => currentStorageContainer;
