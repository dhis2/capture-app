// @flow
import { SystemSettings } from '../../metaData';
import { systemSettingsStore } from '../../metaDataMemoryStores';
import { getMainStorageController } from '../../storageControllers';
import { mainStores } from '../../storageControllers/stores';

async function getSystemSettingsFromStore() {
  const storageController = getMainStorageController();
  return storageController.getAll(mainStores.SYSTEM_SETTINGS);
}

export default async function buildSystemSettingsAsync(cacheData?: ?Array<Object>) {
  const loadedCacheData = cacheData || (await getSystemSettingsFromStore());

  const systemSettings = new SystemSettings();
  loadedCacheData.forEach((setting) => {
    // $FlowFixMe[prop-missing] automated comment
    systemSettings[setting.id] = setting.value;
  });

  systemSettings.trackerAppRelativePath = 'dhis-web-tracker-capture';

  systemSettingsStore.set(systemSettings);
}
