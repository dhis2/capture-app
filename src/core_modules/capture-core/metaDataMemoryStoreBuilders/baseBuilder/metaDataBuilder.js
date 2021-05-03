// @flow
import buildPrograms from '../programs/buildPrograms';
import buildConstants from '../constants/constantsBuilder';
import buildOptionSets from '../optionSets/optionSetsBuilder';
import buildTrackedEntityTypes from '../trackedEntityTypes/trackedEntityTypesBuilder';
import getCommonPrerequisites from './commonPrerequisitesGetter';
import { userStores as stores } from '../../storageControllers/stores';

export default async function buildMetaDataAsync(locale: string) {
    const {
        [stores.TRACKED_ENTITY_TYPES]: cachedTrackedEntityTypes,
        [stores.TRACKED_ENTITY_ATTRIBUTES]: cachedTrackedEntityAttributes,
        [stores.OPTION_SETS]: cachedOptionSets,
    } = await getCommonPrerequisites(stores.TRACKED_ENTITY_ATTRIBUTES, stores.OPTION_SETS, stores.TRACKED_ENTITY_TYPES);

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
