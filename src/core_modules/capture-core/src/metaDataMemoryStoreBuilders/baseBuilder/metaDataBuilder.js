// @flow
import buildPrograms from '../programs/programsBuilder';
import buildConstants from '../constants/constantsBuilder';
import buildOptionSets from '../optionSets/optionSetsBuilder';
import buildTrackedEntityTypes from '../trackedEntityTypes/trackedEntityTypesBuilder';
import getCommonPrerequisites from './commonPrerequisitesGetter';
import { metaDataStores as stores } from '../../storageControllers/stores';

export default async function buildMetaData(locale: string) {
    const preRequisitesData: Object =
        await getCommonPrerequisites(stores.TRACKED_ENTITY_ATTRIBUTES, stores.OPTION_SETS);
    const trackedEntityTypeCollection =
        await buildTrackedEntityTypes(
            stores.TRACKED_ENTITY_TYPES,
            preRequisitesData[stores.TRACKED_ENTITY_ATTRIBUTES],
            preRequisitesData[stores.OPTION_SETS],
            locale,
        );

    const programsBuilderPromise =
        buildPrograms(
            locale,
            preRequisitesData[stores.OPTION_SETS],
            preRequisitesData[stores.TRACKED_ENTITY_ATTRIBUTES],
            trackedEntityTypeCollection,
        );
    const constantsBuilderPromise = buildConstants(stores.CONSTANTS);
    buildOptionSets(preRequisitesData[stores.OPTION_SETS]);
    await Promise.all([programsBuilderPromise, constantsBuilderPromise]);
}
