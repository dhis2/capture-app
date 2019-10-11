// @flow
import { SystemSettings } from '../../metaData/SystemSettings';
import { systemSettingsStore } from '../../metaDataMemoryStores';
import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';
import stores from '../../metaDataStoreLoaders/baseLoader/metaDataObjectStores.const';

async function getSystemSettingsFromStore() {
    const storageController = getStorageController();
    return storageController.getAll(stores.SYSTEM_SETTINGS);
}

export default async function buildSystemSettingsAsync(cacheData?: ?Array<Object>) {
    const loadedCacheData = cacheData || await getSystemSettingsFromStore();

    const systemSettings = new SystemSettings();
    loadedCacheData.forEach((setting) => {
        // $FlowSuppress
        systemSettings[setting.id] = setting.value;
    });

    systemSettingsStore.set(systemSettings);
}
