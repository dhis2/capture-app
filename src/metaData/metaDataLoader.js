// @flow
import StorageContainer from 'capture-core/storage/StorageContainer';
import IndexedDBAdapter from 'capture-core/storage/IndexedDBAdapter';
import LocalStorageAdapter from 'capture-core/storage/DomLocalStorageAdapter';
import programStoresKeys from 'capture-core/metaDataStoreLoaders/programs/programsStoresKeys';
import trackedEntityStoresKeys from 'capture-core/metaDataStoreLoaders/trackedEntityAttributes/trackedEntityAttributesStoresKeys';

import LoadSpecification from 'capture-core/apiToStore/LoadSpecificationDefinition/LoadSpecification';
import getConstantsLoadSpecification from 'capture-core/apiToStore/loadSpecifications/getConstantsLoadSpecification';
import getOrgUnitLevelsLoadSpecification from 'capture-core/apiToStore/loadSpecifications/getOrgUnitLevelsLoadSpecification';
import getRelationshipsLoadSpecification from 'capture-core/apiToStore/loadSpecifications/getRelationshipsLoadSpecification';
import getTrackedEntitiesLoadSpecification from 'capture-core/apiToStore/loadSpecifications/getTrackedEntitiesLoadSpecification';

import getProgramsData from 'capture-core/metaDataStoreLoaders/programs/getPrograms';
import getTrackedEntityAttributes from 'capture-core/metaDataStoreLoaders/trackedEntityAttributes/getTrackedEntityAttributes';
import getOptionSets from 'capture-core/metaDataStoreLoaders/optionSets/getOptionSets';

import objectStores from './metaDataObjectStores.const';
import { set as setStorageContainer } from './metaDataStorageContainer';

const coreLoadSpecifications: Array<LoadSpecification> = [
    getConstantsLoadSpecification(objectStores.CONSTANTS),
    getOrgUnitLevelsLoadSpecification(objectStores.ORGANISATION_UNIT_LEVELS),
    getRelationshipsLoadSpecification(objectStores.RELATIONSHIP_TYPES),
    getTrackedEntitiesLoadSpecification(objectStores.TRACKED_ENTITIES),
];

function loadCoreMetaData(storageContainer: StorageContainer) {
    return Promise.all(coreLoadSpecifications.map(loadSpecification => loadSpecification.load(storageContainer)));
}


async function openStorageContainer() {
    const objectStoreList = Object.keys(objectStores).map(key => objectStores[key]);
    const storageContainer = new StorageContainer('metaData', [IndexedDBAdapter, LocalStorageAdapter], objectStoreList);
    setStorageContainer(storageContainer);
    await storageContainer.open();
    return storageContainer;
}

export default async function loadMetaData() {
    const storageContainer = await openStorageContainer();
    await loadCoreMetaData(storageContainer);
    const { missingPrograms, missingOptionSetIdsFromPrograms } = await getProgramsData(storageContainer, {
        [programStoresKeys.PROGRAMS]: objectStores.PROGRAMS,
        [programStoresKeys.PROGRAM_RULES]: objectStores.PROGRAM_RULES,
        [programStoresKeys.PROGRAM_RULES_VARIABLES]: objectStores.PROGRAM_RULES_VARIABLES,
        [programStoresKeys.PROGRAM_INDICATORS]: objectStores.PROGRAM_INDICATORS,
        [programStoresKeys.OPTION_SETS]: objectStores.OPTION_SETS,
    });

    const trackedEntityAttributesFromPrograms = missingPrograms
        ? missingPrograms.reduce((accAttributes, program) => {
            if (program.programTrackedEntityAttributes) {
                const attributes = program.programTrackedEntityAttributes.map(programAttribute => programAttribute.trackedEntityAttribute);
                return [...accAttributes, ...attributes];
            }
            return accAttributes;
        }, [])
        : null;

    const { missingOptionSetIdsFromTrackedEntityAttributes } = await getTrackedEntityAttributes(storageContainer, {
        [trackedEntityStoresKeys.TRACKED_ENTITY_ATTRIBUTES]: objectStores.TRACKED_ENTITY_ATTRIBUTES,
        [trackedEntityStoresKeys.OPTION_SETS]: objectStores.OPTION_SETS,
    }, trackedEntityAttributesFromPrograms);

    const missingOptionSetIds = [...missingOptionSetIdsFromPrograms, ...missingOptionSetIdsFromTrackedEntityAttributes];
    await getOptionSets(missingOptionSetIds, objectStores.OPTION_SETS, storageContainer);
}
