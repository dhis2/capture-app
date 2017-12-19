// @flow
import StorageContainer from 'capture-core/storage/StorageContainer';

let currentStorageContainer;

export function set(storageContainer: StorageContainer) {
    currentStorageContainer = storageContainer;
}
export default () => currentStorageContainer;
