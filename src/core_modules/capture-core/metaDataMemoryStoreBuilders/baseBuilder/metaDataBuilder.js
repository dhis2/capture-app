// @flow
import { userStores as stores } from '../../storageControllers/stores';
import { buildConstants } from '../constants/constantsBuilder';
import { buildOptionSets } from '../optionSets/optionSetsBuilder';
import { buildPrograms } from '../programs/buildPrograms';
import { buildTrackedEntityTypes } from '../trackedEntityTypes/trackedEntityTypesBuilder';
import { getCommonPrerequisitesAsync } from './commonPrerequisitesGetter';

export async function buildMetaDataAsync(locale: string) {
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
        });

    const programsBuilderPromise =
    buildPrograms({
        cachedTrackedEntityTypes,
        cachedTrackedEntityAttributes,
        cachedOptionSets,
        trackedEntityTypeCollection,
        locale,
    });

    const constantsBuilderPromise = buildConstants(stores.CONSTANTS);
    buildOptionSets(cachedOptionSets);
    await Promise.all([programsBuilderPromise, constantsBuilderPromise]);
}
