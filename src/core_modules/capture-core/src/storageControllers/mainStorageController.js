// @flow
import StorageController from '../storage/StorageController';
import { maintenanceStores } from './stores';

function createStorageController(storageName: string, AdapterClasses: Array<any>) {
    const storageController =
        new StorageController(
            storageName,
            1,
            AdapterClasses,
            Object.keys(maintenanceStores).map(key => maintenanceStores[key]),
        );
    return storageController;
}

export default createStorageController;
