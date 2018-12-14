// @flow
import buildPrograms from '../programs/programsBuilder';
import buildConstants from '../constants/constantsBuilder';
import buildOptionSets from '../optionSets/optionSetsBuilder';
import buildTrackedEntityTypes from '../trackedEntityTypes/trackedEntityTypesBuilder';
import stores from '../../metaDataStoreLoaders/baseLoader/metaDataObjectStores.const';
import getCommonPrerequisites from './commonPrerequisitesGetter';


export default async function buildMetaData(locale: string) {
    const preRequisitesData = await getCommonPrerequisites(stores.TRACKED_ENTITY_ATTRIBUTES, stores.OPTION_SETS);
    const trackedEntityTypeCollection =
        // $FlowFixMe
        await buildTrackedEntityTypes(stores.TRACKED_ENTITY_TYPES, preRequisitesData[stores.TRACKED_ENTITY_ATTRIBUTES]);

    const programsBuilderPromise =
        buildPrograms(
            locale,
            stores.PROGRAMS,
            stores.OPTION_SETS,
            stores.PROGRAM_RULES_VARIABLES,
            stores.PROGRAM_RULES,
            stores.PROGRAM_INDICATORS,
            stores.RELATIONSHIP_TYPES,
            preRequisitesData[stores.TRACKED_ENTITY_ATTRIBUTES],
            trackedEntityTypeCollection,
        );
    const constantsBuilderPromise = buildConstants(stores.CONSTANTS);
    const optionSetsBuilderPromise = buildOptionSets(stores.OPTION_SETS);
    await Promise.all([programsBuilderPromise, constantsBuilderPromise, optionSetsBuilderPromise]);
}
