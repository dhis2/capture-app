import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getUserDataStorageController, USER_DATA_STORES } from 'capture-core/storageControllers';

export type ActiveList = {
    configKey: string;
};

export const getBulkDataEntry = async (programId: string) => {
    try {
        const storageController = getUserDataStorageController();
        return await storageController.get(USER_DATA_STORES.BULK_DATA_ENTRY, programId);
    } catch (error) {
        log.error(errorCreator('Could not get a bulkDataEntry value from IndexedDB ')({ error }));
        return null;
    }
};

export const setBulkDataEntry = async (bulkDataEntry: { id: string; activeList: ActiveList }) => {
    try {
        const storageController = getUserDataStorageController();
        await storageController.set(USER_DATA_STORES.BULK_DATA_ENTRY, bulkDataEntry);
    } catch (error) {
        log.error(errorCreator('Could not set a bulkDataEntry value to IndexedDB ')({ error }));
    }
};

export const removeBulkDataEntry = async (id: string) => {
    try {
        const storageController = getUserDataStorageController();
        await storageController.remove(USER_DATA_STORES.BULK_DATA_ENTRY, id);
    } catch (error) {
        log.error(errorCreator('Could not remove a bulkDataEntry value from IndexedDB ')({ error }));
    }
};
