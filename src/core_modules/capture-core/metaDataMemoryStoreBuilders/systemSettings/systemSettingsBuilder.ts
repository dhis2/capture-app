import { SystemSettings } from '../../metaData';
import { systemSettingsStore } from '../../metaDataMemoryStores';
import { getMainStorageController, MAIN_STORES } from '../../storageControllers';

async function getSystemSettingsFromStore() {
    const storageController = getMainStorageController();
    return storageController.getAll(MAIN_STORES.SYSTEM_SETTINGS);
}

export async function buildSystemSettingsAsync(cacheData?: any[]) {
    const loadedCacheData = cacheData || await getSystemSettingsFromStore();

    const systemSettings = new SystemSettings();
    loadedCacheData.forEach((setting) => {
        (systemSettings as any)[setting.id] = setting.value;
    });

    systemSettings.trackerAppRelativePath = 'dhis-web-tracker-capture';

    systemSettingsStore.set(systemSettings);
}
