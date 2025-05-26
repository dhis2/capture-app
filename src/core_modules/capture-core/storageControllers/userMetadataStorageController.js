// @flow
import { StorageController, IndexedDBAdapter } from 'capture-core-utils/storage';
import { USER_METADATA_STORES } from './constants';
import type { Input } from './userMetadataStorageController.types';

const createStorageController = ({
    storageName,
    version,
    adapterTypes,
}) => new StorageController(
    storageName,
    version,
    {
        Adapters: adapterTypes,
        objectStores: Object.values(USER_METADATA_STORES),
    },
);

const storeSpecificCreateActions = {
    [USER_METADATA_STORES.CATEGORY_OPTIONS]: (objectStore) => {
        objectStore.createIndex('categoryId', 'categories', { multiEntry: true });
    },
    [USER_METADATA_STORES.PROGRAM_RULES]: (objectStore) => {
        objectStore.createIndex('programId', 'programId');
    },
    [USER_METADATA_STORES.PROGRAM_RULES_VARIABLES]: (objectStore) => {
        objectStore.createIndex('programId', 'programId');
    },
    [USER_METADATA_STORES.PROGRAM_INDICATORS]: (objectStore) => {
        objectStore.createIndex('programId', 'programId');
    },
    [USER_METADATA_STORES.ORGANISATION_UNIT_GROUPS]: (objectStore) => {
        objectStore.createIndex('organisationUnitId', 'organisationUnitIds', { multiEntry: true });
    },
};

export const initUserMetadataController = async ({
    storageName,
    version,
    adapterTypes,
}: Input) => {
    const userStorageController =
        createStorageController({ storageName, version, adapterTypes });

    await userStorageController
        .open({
            onCreateObjectStore: (objectStore, adapter) => {
                if (adapter === IndexedDBAdapter) {
                    storeSpecificCreateActions[objectStore.name] &&
                    storeSpecificCreateActions[objectStore.name](objectStore);
                }
            },
        });
    return userStorageController;
};
