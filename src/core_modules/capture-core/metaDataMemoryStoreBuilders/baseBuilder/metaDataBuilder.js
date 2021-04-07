// @flow
import { buildPrograms } from '../programs/programsBuilder';
import { buildConstants } from '../constants/constantsBuilder';
import { buildOptionSets } from '../optionSets/optionSetsBuilder';
import { buildTrackedEntityTypes } from '../trackedEntityTypes/trackedEntityTypesBuilder';
import { getCommonPrerequisitesAsync } from './commonPrerequisitesGetter';
import { userStores as stores } from '../../storageControllers/stores';

export async function buildMetaDataAsync(locale: string) {
    const preRequisitesData: Object =
        await getCommonPrerequisitesAsync(stores.TRACKED_ENTITY_ATTRIBUTES, stores.OPTION_SETS, stores.TRACKED_ENTITY_TYPES);
    const trackedEntityTypeCollection =
        await buildTrackedEntityTypes(
            preRequisitesData[stores.TRACKED_ENTITY_TYPES],
            preRequisitesData[stores.TRACKED_ENTITY_ATTRIBUTES],
            preRequisitesData[stores.OPTION_SETS],
            locale,
        );

    const programsBuilderPromise =
        buildPrograms(
            locale,
            preRequisitesData[stores.OPTION_SETS],
            preRequisitesData[stores.TRACKED_ENTITY_ATTRIBUTES],
            preRequisitesData[stores.TRACKED_ENTITY_TYPES],
            trackedEntityTypeCollection,
        );
    const constantsBuilderPromise = buildConstants(stores.CONSTANTS);
    buildOptionSets(preRequisitesData[stores.OPTION_SETS]);
    await Promise.all([programsBuilderPromise, constantsBuilderPromise]);
}
