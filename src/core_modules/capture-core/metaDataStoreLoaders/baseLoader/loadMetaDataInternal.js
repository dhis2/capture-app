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

const loadCoreMetaData = () =>
    Promise.all(
        [
            storeConstants,
            storeOrgUnitLevels,
            storeRelationshipTypes,
            storeOrgUnitGroups,
        ].map(operation => operation()),
    );

/**
 * Retrieves metadata from the api and stores it in IndexedDB. Some load functions returns side effects used by other functions.
 */
export const loadMetaDataInternal = async () => {
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
