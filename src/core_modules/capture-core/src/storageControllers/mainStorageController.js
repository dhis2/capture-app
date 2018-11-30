// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { maintenanceStores } from './stores';

function createStorageController(storageName: string, AdapterClasses: Array<any>) {
    const storageController =
        new StorageController(
            storageName,
            1,
            AdapterClasses,
            Object.keys(maintenanceStores).map(key => maintenanceStores[key]),
            storage => storage.set(maintenanceStores.STATUS, {
                id: 'fallback',
                value: true,
            }),
        );
    return storageController;
}

export default createStorageController;
