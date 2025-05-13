// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getUserStorageController, userStores } from '../storageControllers';

export type ActiveList = {|
    configKey: string,
|};

export const getBulkDataEntry = async (programId: string) => {
    try {
        const storageController = getUserStorageController();
        return storageController.get(userStores.BULK_DATA_ENTRY, programId);
    } catch (error) {
        log.error(errorCreator('Could not get a bulkDataEntry value from IndexDB ')({ error }));
        return null;
    }
};

export const setBulkDataEntry = async (bulkDataEntry: { id: string, activeList: ActiveList }) => {
    try {
        const storageController = getUserStorageController();
        await storageController.set(userStores.BULK_DATA_ENTRY, bulkDataEntry);
    } catch (error) {
        log.error(errorCreator('Could not set a bulkDataEntry value to IndexDB ')({ error }));
    }
};

export const removeBulkDataEntry = async (id: string) => {
    try {
        const storageController = getUserStorageController();
        await storageController.remove(userStores.BULK_DATA_ENTRY, id);
    } catch (error) {
        log.error(errorCreator('Could not remove a bulkDataEntry value from IndexDB ')({ error }));
    }
};
