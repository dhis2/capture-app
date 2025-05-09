// @flow
import { StorageController } from 'capture-core-utils/storage';
import { USER_DATA_STORES } from './constants';
import type { Input } from './userDataStorageController.types';

const createStorageController = ({
    storageName,
    adapterTypes,
}) => {
    const storageController = new StorageController(
        storageName,
        2,
        {
            Adapters: adapterTypes,
            objectStores: Object.values(USER_DATA_STORES),
        },
    );
    return storageController;
};

export const initUserDataStorageController = async ({
    storageName,
    adapterTypes,
}: Input) => {
    const userStorageController =
        createStorageController({ storageName, adapterTypes });

    await userStorageController.open();
    return userStorageController;
};
