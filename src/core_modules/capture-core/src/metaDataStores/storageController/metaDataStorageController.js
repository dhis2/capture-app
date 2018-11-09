// @flow
import StorageController from '../../storage/StorageController';

let currentStorageController;

export function set(storageController: StorageController) {
    currentStorageController = storageController;
}
export default () => currentStorageController;
