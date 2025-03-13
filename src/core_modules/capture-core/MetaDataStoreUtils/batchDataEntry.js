// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getUserStorageController, userStores } from '../storageControllers';

type ActiveList = {|
    dataKey?: string,
    configKey: string,
    pluginUrl: string,
    title: string,
|};

export const getBatchDataEntry = async (programId: string) => {
    try {
        const storageController = getUserStorageController();
        return storageController.get(userStores.BATCH_DATA_ENTRY, programId);
    } catch (error) {
        log.error(errorCreator('Could not get a batchDataEntry value from IndexDB ')({ error }));
        return null;
    }
};

export const setBatchDataEntry = async (batchDataEntry: { id: string, activeList: ActiveList }) => {
    try {
        const storageController = getUserStorageController();
        await storageController.set(userStores.BATCH_DATA_ENTRY, batchDataEntry);
    } catch (error) {
        log.error(errorCreator('Could not set a batchDataEntry value to IndexDB ')({ error }));
    }
};

export const removeBatchDataEntry = async (id: string) => {
    try {
        const storageController = getUserStorageController();
        await storageController.remove(userStores.BATCH_DATA_ENTRY, id);
    } catch (error) {
        log.error(errorCreator('Could not remove a batchDataEntry value from IndexDB ')({ error }));
    }
};
