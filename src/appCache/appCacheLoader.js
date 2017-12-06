// @flow
import StorageContainer from 'd2-tracker/storage/StorageContainer';
import LoadSpecification from 'd2-tracker/apiToStore/LoadSpecificationDefinition/LoadSpecification';
import IndexedDBAdapter from 'd2-tracker/storage/IndexedDBAdapter';
import LocalStorageAdapter from 'd2-tracker/storage/DomLocalStorageAdapter';

import getSystemSettingsLoadSpecification
    from 'd2-tracker/apiToStore/loadSpecifications/getSystemSettingsLoadSpecification';

import objectStores from './appCacheObjectStores.const';
import { set as setStorageContainer } from './appCacheStorageContainer';

const coreLoadSpecifications: Array<LoadSpecification> = [
    getSystemSettingsLoadSpecification(objectStores.SYSTEM_SETTINGS),
];

function loadCoreMetaData(storageContainer: StorageContainer) {
    return Promise.all(coreLoadSpecifications.map(loadSpecification => loadSpecification.load(storageContainer)));
}

async function openStorageContainer() {
    const objectStoreList = Object.keys(objectStores).map(key => objectStores[key]);
    const storageContainer = new StorageContainer('appCache', [IndexedDBAdapter, LocalStorageAdapter], objectStoreList);
    setStorageContainer(storageContainer);
    await storageContainer.open();
    return storageContainer;
}

export default async function loadAppCacheData() {
    const storageContainer = await openStorageContainer();
    await loadCoreMetaData(storageContainer);
}
