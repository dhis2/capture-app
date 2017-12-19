// @flow
import StorageContainer from 'capture-core/storage/StorageContainer';
import LocalStorageAdapter from 'capture-core/storage/DomLocalStorageAdapter';
import getD2 from 'capture-core/d2/d2Instance';

import objectStores from './sessionCacheObjectStores.const';
import { set as setStorageContainer } from './sessionCacheStorageContainer';

async function loadSystemSettings(storageContainer: StorageContainer, d2: D2) {
    const currentStoreContents = await storageContainer.getAll(objectStores.SYSTEM_SETTINGS);
    if (!currentStoreContents || currentStoreContents.length === 0) {
        const systemSettings = await d2.system.settings.all();
        if (systemSettings) {
            systemSettings.id = 'systemSettings';
            await storageContainer.set(objectStores.SYSTEM_SETTINGS, systemSettings);
        }
    }
}

async function openStorageContainer() {
    const objectStoreList = Object.keys(objectStores).map(key => objectStores[key]);
    const storageContainer = new StorageContainer('sessionCache', [LocalStorageAdapter], objectStoreList);
    setStorageContainer(storageContainer);
    await storageContainer.open();
    return storageContainer;
}

export default async function loadSessionCacheData() {
    const storageContainer = await openStorageContainer();
    const d2 = getD2();
    await loadSystemSettings(storageContainer, d2);
}
