// @flow
import StorageContainer from 'd2-tracker/storage/StorageContainer';
import IndexedDBAdapter from 'd2-tracker/storage/IndexedDBAdapter';
import LocalStorageAdapter from 'd2-tracker/storage/DomLocalStorageAdapter';
import { loadStoreData, loadStoreDataIfNotExists } from 'd2-tracker/metaData/loader/storeDataLoaders';

import LoadSpecification from 'd2-tracker/metaData/loadSpecifications/LoadSpecification';
import getConstantsLoadSpecification from 'd2-tracker/metaData/loadSpecifications/getConstantsLoadSpecification';
import getOrgUnitLevelsLoadSpecification from 'd2-tracker/metaData/loadSpecifications/getOrgUnitLevelsLoadSpecification';
import getRelationshipsLoadSpecification from 'd2-tracker/metaData/loadSpecifications/getRelationshipsLoadSpecification';
import getTrackedEntitiesLoadSpecification from 'd2-tracker/metaData/loadSpecifications/getTrackedEntitiesLoadSpecification';
import getSystemSettingsLoadSpecification from './loadSpecifications/getSystemSettingsLoadSpecification';

import objectStores from './metaDataObjectStores.const';
import { set as setStorageContainer } from './metaDataStorageContainer';

const coreLoadSpecifications: Array<LoadSpecification> = [
    getConstantsLoadSpecification(objectStores.CONSTANTS),
    getOrgUnitLevelsLoadSpecification(objectStores.ORGANISATION_UNIT_LEVELS),
    getRelationshipsLoadSpecification(objectStores.RELATIONSHIP_TYPES),
    getTrackedEntitiesLoadSpecification(objectStores.TRACKED_ENTITIES),
];

/*
function composeLoadSpecifications(specifiationsLoaders: Array<() => ?Array<LoadSpecification>>) {
    return specifiationsLoaders.reduce((accSpecifications: Array<LoadSpecification>, specLoader: () => ?Array<LoadSpecification>) => {
        const loadSpecifications = specLoader();
        if (loadSpecifications) {
            accSpecifications = [...accSpecifications, ...loadSpecifications];
        }
        return accSpecifications;
    }, []);
}
*/


async function openStorageContainer() {
    const objectStoreList = Object.keys(objectStores).map(key => objectStores[key]);
    const storageContainer = new StorageContainer('metaData', [IndexedDBAdapter, LocalStorageAdapter], objectStoreList);
    setStorageContainer(storageContainer);
    await storageContainer.open();
    return storageContainer;
}

export default async function loadMetaData() {
    const storageContainer = await openStorageContainer();
    return Promise.all(coreLoadSpecifications.map(loadSpecification => loadSpecification.load(storageContainer)));
}

