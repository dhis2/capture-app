// @flow
import { getD2 } from '../../d2';
import { getMainStorageController } from '../../storageControllers';
import { mainStores } from '../../storageControllers/stores';

export default async function loadSystemSettingsAsync() {
    const d2 = getD2();
    const d2SystemInfo = d2.system.systemInfo;
    const systemSettingsArray = [
        {
            id: 'dateFormat',
            value: d2SystemInfo.dateFormat.toUpperCase(),
        },
    ];

    const storageController = getMainStorageController();
    await storageController.setAll(mainStores.SYSTEM_SETTINGS, systemSettingsArray);
    return systemSettingsArray;
}
