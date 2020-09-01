// @flow
import { StorageController } from 'capture-core-utils/storage';

let currentStorageContainer;

export function set(storageContainer: typeof StorageController) {
    currentStorageContainer = storageContainer;
}
export default () => currentStorageContainer;
