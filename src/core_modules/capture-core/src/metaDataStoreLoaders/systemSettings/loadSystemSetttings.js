// @flow
import getD2 from '../../d2/d2Instance';
import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';
import stores from '../../metaDataStoreLoaders/baseLoader/metaDataObjectStores.const';

export default async function loadSystemSettingsAsync() {
    const d2 = getD2();
    const d2SystemInfo = d2.system.systemInfo;
    const systemSettingsArray = [
        {
            id: 'dateFormat',
            value: d2SystemInfo.dateFormat.toUpperCase(),
        },
    ];

    const storageController = getStorageController();
    await storageController.setAll(stores.SYSTEM_SETTINGS, systemSettingsArray);
    return systemSettingsArray;
}
