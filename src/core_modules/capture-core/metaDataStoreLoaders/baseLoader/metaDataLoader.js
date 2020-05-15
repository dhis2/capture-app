// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import programStoresKeys from '../programs/programsStoresKeys';

import LoadSpecification from '../../apiToStore/LoadSpecificationDefinition/LoadSpecification';
import getConstantsLoadSpecification from '../../apiToStore/loadSpecifications/getConstantsLoadSpecification';
import getOrgUnitLevelsLoadSpecification from '../../apiToStore/loadSpecifications/getOrgUnitLevelsLoadSpecification';
import getRelationshipsLoadSpecification from '../../apiToStore/loadSpecifications/getRelationshipsLoadSpecification';

import loadPrograms from '../programs/loadPrograms';
import loadTrackedEntityAttributes from '../trackedEntityAttributes/loadTrackedEntityAttributes';
import loadCategories from '../categories/loadCategories';
import loadOptionSets from '../optionSets/loadOptionSets';
import loadTrackedEntityTypes from '../trackedEntityTypes/loadTrackedEntityTypes';
import executeUsersCacheMaintenance from '../maintenance/usersCacheMaintenance';

import { userStores as objectStores } from '../../storageControllers/stores';
import { getUserStorageController } from '../../storageControllers';

const coreLoadSpecifications: Array<LoadSpecification> = [
    getConstantsLoadSpecification(objectStores.CONSTANTS),
    getOrgUnitLevelsLoadSpecification(objectStores.ORGANISATION_UNIT_LEVELS),
    getRelationshipsLoadSpecification(objectStores.RELATIONSHIP_TYPES),
];

async function loadCoreMetaData(storageController: StorageController) {
    // uses asyncForEach instead of Promise.all to make sure indexedDB is not blocked if fallback to memory storage is needed
    // $FlowFixMe
    await coreLoadSpecifications.asyncForEach(loadSpecification => loadSpecification.load(storageController));
}

function removeDuplicatesFromStringArray(array: Array<string>) {
    const set = new Set(array);
    return Array.from(set);
}

export async function loadMetaData() {
    const storageController = getUserStorageController();
    await executeUsersCacheMaintenance();
    await loadCoreMetaData(storageController);

    const {
        optionSetsMeta: optionSetsMetaFromPrograms,
        trackedEntityAttributeIds: trackedEntityAttributeIdsFromPrograms,
        categoryIds,
    } = await loadPrograms(storageController, {
        [programStoresKeys.PROGRAMS]: objectStores.PROGRAMS,
        [programStoresKeys.PROGRAM_RULES]: objectStores.PROGRAM_RULES,
        [programStoresKeys.PROGRAM_RULES_VARIABLES]: objectStores.PROGRAM_RULES_VARIABLES,
        [programStoresKeys.PROGRAM_INDICATORS]: objectStores.PROGRAM_INDICATORS,
        [programStoresKeys.OPTION_SETS]: objectStores.OPTION_SETS,
    });

    const {
        trackedEntityAttributeIds: trackedEntityAttributeIdsFromTrackedEntityTypes,
        optionSetsMeta: optionSetsMetaFromTrackedEntityTypes,
    } = await loadTrackedEntityTypes(storageController, objectStores.TRACKED_ENTITY_TYPES);

    await loadTrackedEntityAttributes(
        storageController,
        objectStores.TRACKED_ENTITY_ATTRIBUTES,
        removeDuplicatesFromStringArray([
            ...trackedEntityAttributeIdsFromPrograms,
            ...trackedEntityAttributeIdsFromTrackedEntityTypes,
        ]),
    );

    await loadCategories(storageController, categoryIds, {
        categories: objectStores.CATEGORIES,
        categoryOptionsByCategory: objectStores.CATEGORY_OPTIONS_BY_CATEGORY,
        categoryOptions: objectStores.CATEGORY_OPTIONS,
    });
    await loadOptionSets(storageController, objectStores.OPTION_SETS, [...optionSetsMetaFromPrograms, ...optionSetsMetaFromTrackedEntityTypes]);
}
