// @flow
import {
    storeConstants,
    storeOrgUnitLevels,
    storeRelationshipTypes,
} from './quickStoreOperations';
import { loadPrograms } from '../programs';
import { loadTrackedEntityTypes } from '../trackedEntityTypes';
import { loadTrackedEntityAttributes } from '../trackedEntityAttributes';
import { loadCategories } from '../categories';
import { loadOptionSets } from '../optionSets';
import { executeUsersCacheMaintenance } from '../maintenance';

async function loadCoreMetaData() {
    return Promise.all(
        [
            storeConstants,
            storeOrgUnitLevels,
            storeRelationshipTypes,
        ].map(operation => operation()),
    );
}
export const loadMetaDataInternal = async () => {
    await executeUsersCacheMaintenance();
    const {
        optionSetsOutline: optionSetsOutlineFromPrograms,
        trackedEntityAttributeIds: trackedEntityAttributeIdsFromPrograms,
        categoryIds,
    } = await loadPrograms();
    await loadCoreMetaData();

    const {
        trackedEntityAttributeIds: trackedEntityAttributeIdsFromTrackedEntityTypes,
        optionSetsOutline: optionSetsOutlineFromTrackedEntityTypes,
    } = await loadTrackedEntityTypes();

    await loadTrackedEntityAttributes([
        ...trackedEntityAttributeIdsFromPrograms,
        ...trackedEntityAttributeIdsFromTrackedEntityTypes,
    ]);

    await loadCategories(categoryIds);

    await loadOptionSets([...optionSetsOutlineFromPrograms, ...optionSetsOutlineFromTrackedEntityTypes]);
};
