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
 * Retrieves metadata from the api and stores it in IndexedDB.
 * This way we don't have to redownload all the metadata every time, but only the parts that have changed.
 * Most metadata is redownloaded based on a program version change.
 * The option sets have their own version and are redonloaded based on that.
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
