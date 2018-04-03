// @flow
import StorageContainer from '../../storage/StorageContainer';

let currentStorageContainer;

export function set(storageContainer: StorageContainer) {
    currentStorageContainer = storageContainer;
}
export default () => currentStorageContainer;
