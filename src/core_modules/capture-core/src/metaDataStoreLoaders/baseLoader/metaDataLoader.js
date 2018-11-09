// @flow
import StorageController from '../../storage/StorageController';
import IndexedDBAdapter from '../../storage/IndexedDBAdapter';
import LocalStorageAdapter from '../../storage/DomLocalStorageAdapter';
import programStoresKeys from '../programs/programsStoresKeys';
import trackedEntityStoresKeys from '../trackedEntityAttributes/trackedEntityAttributesStoresKeys';

import LoadSpecification from '../../apiToStore/LoadSpecificationDefinition/LoadSpecification';
import getConstantsLoadSpecification from '../../apiToStore/loadSpecifications/getConstantsLoadSpecification';
import getOrgUnitLevelsLoadSpecification from '../../apiToStore/loadSpecifications/getOrgUnitLevelsLoadSpecification';
import getRelationshipsLoadSpecification from '../../apiToStore/loadSpecifications/getRelationshipsLoadSpecification';
import getTrackedEntitiesLoadSpecification
    from '../../apiToStore/loadSpecifications/getTrackedEntitiesLoadSpecification';

import organisationUnitApiSpecification from '../../api/apiSpecifications/organisationUnits.apiSpecification';
import getOrganisationUnitsLoadSpecification
    from '../../apiToStore/loadSpecifications/getOrganisationUnitsLoadSpecification';

import getProgramsData from '../programs/getPrograms';
import getTrackedEntityAttributes from '../trackedEntityAttributes/getTrackedEntityAttributes';
import getOptionSets from '../optionSets/getOptionSets';

import objectStores from './metaDataObjectStores.const';
import { set as setStorageController } from '../../metaDataStores/storageController/metaDataStorageController';

const coreLoadSpecifications: Array<LoadSpecification> = [
    getConstantsLoadSpecification(objectStores.CONSTANTS),
    getOrgUnitLevelsLoadSpecification(objectStores.ORGANISATION_UNIT_LEVELS),
    getRelationshipsLoadSpecification(objectStores.RELATIONSHIP_TYPES),
    getTrackedEntitiesLoadSpecification(objectStores.TRACKED_ENTITIES),
    getOrganisationUnitsLoadSpecification(objectStores.ORGANISATION_UNITS, organisationUnitApiSpecification),
];

function loadCoreMetaData(storageController: StorageController) {
    return Promise.all(coreLoadSpecifications.map(loadSpecification => loadSpecification.load(storageController)));
}

function getCacheVersion() {
    const appCacheVersionAsString = appPackage.CACHE_VERSION; // eslint-disable-line
    if (!appCacheVersionAsString) {
        throw new Error('cache version not specified');
    }
    const appCacheVersion = Number(appCacheVersionAsString);
    if (Number.isNaN(appCacheVersion) || !Number.isSafeInteger(appCacheVersion)) {
        throw new Error('invalid cache version');
    }
    return appCacheVersion;
}

function createStorageController() {
    const objectStoreList = Object.keys(objectStores).map(key => objectStores[key]);
    const appCacheVersion = getCacheVersion();
    const storageController =
        new StorageController('dhis2ca', appCacheVersion, [IndexedDBAdapter, LocalStorageAdapter], objectStoreList);
    setStorageController(storageController);
    return storageController;
}

async function openStorage(storageController: StorageController) {
    await storageController.open();
}

export default async function loadMetaData() {
    const storageController = createStorageController();
    await openStorage(storageController);
    await loadCoreMetaData(storageController);
    const { missingPrograms, missingOptionSetIdsFromPrograms } = await getProgramsData(storageController, {
        [programStoresKeys.PROGRAMS]: objectStores.PROGRAMS,
        [programStoresKeys.PROGRAM_RULES]: objectStores.PROGRAM_RULES,
        [programStoresKeys.PROGRAM_RULES_VARIABLES]: objectStores.PROGRAM_RULES_VARIABLES,
        [programStoresKeys.PROGRAM_INDICATORS]: objectStores.PROGRAM_INDICATORS,
        [programStoresKeys.OPTION_SETS]: objectStores.OPTION_SETS,
    });

    const trackedEntityAttributesFromPrograms = missingPrograms
        ? missingPrograms.reduce((accAttributes, program) => {
            if (program.programTrackedEntityAttributes) {
                const attributes =
                    program.programTrackedEntityAttributes
                        .map(programAttribute => programAttribute.trackedEntityAttribute);
                return [...accAttributes, ...attributes];
            }
            return accAttributes;
        }, [])
        : null;

    const { missingOptionSetIdsFromTrackedEntityAttributes } = await getTrackedEntityAttributes(storageController, {
        [trackedEntityStoresKeys.TRACKED_ENTITY_ATTRIBUTES]: objectStores.TRACKED_ENTITY_ATTRIBUTES,
        [trackedEntityStoresKeys.OPTION_SETS]: objectStores.OPTION_SETS,
    }, trackedEntityAttributesFromPrograms);

    const missingOptionSetIds = [...missingOptionSetIdsFromPrograms, ...missingOptionSetIdsFromTrackedEntityAttributes];
    await getOptionSets(missingOptionSetIds, objectStores.OPTION_SETS, storageController);
}
