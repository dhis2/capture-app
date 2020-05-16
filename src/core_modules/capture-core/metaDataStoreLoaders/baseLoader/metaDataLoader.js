// @flow
import {
    storeConstants,
    storeOrgUnitLevels,
    storeRelationshipTypes,
    storeOrgUnitGroups,
} from './quickStoreOperations';
import { loadPrograms } from '../programs';
import { loadTrackedEntityTypes } from '../trackedEntityTypes';
import { loadTrackedEntityAttributes } from '../trackedEntityAttributes';
import { loadCategories } from '../categories';
import { loadOptionSets } from '../optionSets';
import { executeUsersCacheMaintenance } from '../maintenance';

const coreStoreOperations = [
    storeConstants,
    storeOrgUnitLevels,
    storeRelationshipTypes,
    storeOrgUnitGroups,
];

function loadCoreMetaData() {
    return Promise.all(
        coreStoreOperations.map(operation => operation()),
    );
}
export const loadMetaData = async () => {
    await executeUsersCacheMaintenance();
    const {
        optionSetsOutline: optionSetsOutlineFromPrograms,
        trackedEntityAttributeIds: trackedEntityAttributeIdsFromPrograms,
        categories,
        trackedEntityTypeIds,
        changesDetected,
    } = await loadPrograms();

    changesDetected && await loadCoreMetaData();

    const {
        trackedEntityAttributeIds: trackedEntityAttributeIdsFromTrackedEntityTypes,
        optionSetsOutline: optionSetsOutlineFromTrackedEntityTypes,
    } = await loadTrackedEntityTypes(trackedEntityTypeIds);

    await loadTrackedEntityAttributes([
        ...trackedEntityAttributeIdsFromPrograms,
        ...trackedEntityAttributeIdsFromTrackedEntityTypes,
    ]);

    await loadCategories(categories);
    await loadOptionSets([
        ...optionSetsOutlineFromPrograms,
        ...optionSetsOutlineFromTrackedEntityTypes,
    ],
    );
};
