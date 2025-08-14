import { buildPrograms } from '../programs/buildPrograms';
import { buildConstants } from '../constants/constantsBuilder';
import { buildOptionSets } from '../optionSets/optionSetsBuilder';
import { buildTrackedEntityTypes } from '../trackedEntityTypes/trackedEntityTypesBuilder';
import { getCommonPrerequisitesAsync } from './commonPrerequisitesGetter';
import { USER_METADATA_STORES as stores } from '../../storageControllers';

export async function buildMetaDataAsync(locale: string, minorServerVersion: number) {
    const commonPrerequisites = await getCommonPrerequisitesAsync(
        stores.TRACKED_ENTITY_ATTRIBUTES as keyof typeof stores,
        stores.OPTION_SETS as keyof typeof stores,
        stores.TRACKED_ENTITY_TYPES as keyof typeof stores,
    );
    const cachedTrackedEntityTypes = commonPrerequisites[stores.TRACKED_ENTITY_TYPES];
    const cachedTrackedEntityAttributes = commonPrerequisites[stores.TRACKED_ENTITY_ATTRIBUTES];
    const cachedOptionSets = commonPrerequisites[stores.OPTION_SETS];

    const trackedEntityTypeCollection =
        await buildTrackedEntityTypes({
            cachedTrackedEntityTypes,
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
            minorServerVersion,
        });

    const programsBuilderPromise =
    buildPrograms({
        cachedTrackedEntityTypes,
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        trackedEntityTypeCollection,
        locale,
        minorServerVersion,
    });

    const constantsBuilderPromise = buildConstants(stores.CONSTANTS);
    buildOptionSets(cachedOptionSets);
    await Promise.all([programsBuilderPromise, constantsBuilderPromise]);
}
