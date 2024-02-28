// @flow
import { buildPrograms } from '../programs/buildPrograms';
import { buildConstants } from '../constants/constantsBuilder';
import { buildOptionSets } from '../optionSets/optionSetsBuilder';
import { buildTrackedEntityTypes } from '../trackedEntityTypes/trackedEntityTypesBuilder';
import { getCommonPrerequisitesAsync } from './commonPrerequisitesGetter';
import { userStores as stores } from '../../storageControllers/stores';

export async function buildMetaDataAsync(locale: string, minorServerVersion: number) {
    const {
        [stores.TRACKED_ENTITY_TYPES]: cachedTrackedEntityTypes,
        [stores.TRACKED_ENTITY_ATTRIBUTES]: cachedTrackedEntityAttributes,
        [stores.OPTION_SETS]: cachedOptionSets,
    } = await getCommonPrerequisitesAsync(stores.TRACKED_ENTITY_ATTRIBUTES, stores.OPTION_SETS, stores.TRACKED_ENTITY_TYPES);

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
