import {
    storeConstants,
    storeOrgUnitLevels,
    storeRelationshipTypes,
    storeOrgUnitGroups,
} from './quickStoreOperations';
import { loadPrograms } from '../programs';
import { loadTrackedEntityTypes } from '../trackedEntityTypes';
import { loadTrackedEntityAttributes } from '../trackedEntityAttributes';
import { loadDataElements } from '../dataElements';
import { loadCategories } from '../categories';
import { loadOptionSets } from '../optionSets';
import { confirmLoadingSequence } from './confirmLoadingSequence';

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
 * We don't download all the metadata every time, only the parts that have changed.
 * Most metadata is redownloaded based on a program version change.
 * The option sets have their own version and are redownloaded based on that.
 */
export const loadMetaDataInternal = async () => {
    const {
        optionSetsOutline: optionSetsOutlineFromPrograms,
        trackedEntityAttributeIds: trackedEntityAttributeIdsFromPrograms,
        dataElementIds,
        categories,
        trackedEntityTypeIds,
        changesDetected,
        stalePrograms,
        optionSetsFromProgramsLoaded,
    } = await loadPrograms();

    const optionSetIdsFromPrograms = new Set(optionSetsOutlineFromPrograms.map(({ id }) => id));

    const loadTrackedEntityTypesAndDependencies = async () => {
        const {
            trackedEntityAttributeIds: trackedEntityAttributeIdsFromTrackedEntityTypes,
            optionSetsOutline: optionSetsOutlineFromTrackedEntityTypes,
        } = await loadTrackedEntityTypes(trackedEntityTypeIds);

        await Promise.all([
            loadTrackedEntityAttributes([
                ...trackedEntityAttributeIdsFromPrograms,
                ...trackedEntityAttributeIdsFromTrackedEntityTypes,
            ]),
            loadOptionSets(optionSetsOutlineFromTrackedEntityTypes
                .filter(({ id }) => !optionSetIdsFromPrograms.has(id))),
        ]);
    };

    await Promise.all([
        optionSetsFromProgramsLoaded,
        changesDetected && loadCoreMetaData(),
        loadTrackedEntityTypesAndDependencies(),
        loadDataElements(dataElementIds),
        loadCategories(categories),
    ]);

    // set program version to cache to confirm loading of programs and their dependencies
    await confirmLoadingSequence(stalePrograms);
};
