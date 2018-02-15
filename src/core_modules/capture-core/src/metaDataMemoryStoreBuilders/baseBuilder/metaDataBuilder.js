// @flow
import buildPrograms from '../programs/programsBuilder';
import buildConstants from '../constants/constantsBuilder';
import buildOptionSets from '../optionSets/optionSetsBuilder';
import stores from '../../metaDataStoreLoaders/baseLoader/metaDataObjectStores.const';

export default async function buildMetaData(locale: string) {
    const programsBuilderPromise = buildPrograms(locale, stores.PROGRAMS, stores.OPTION_SETS, stores.PROGRAM_RULES_VARIABLES, stores.PROGRAM_RULES);
    const constantsBuilderPromise = buildConstants(stores.CONSTANTS);
    const optionSetsBuilderPromise = buildOptionSets(stores.OPTION_SETS);
    await Promise.all([programsBuilderPromise, constantsBuilderPromise, optionSetsBuilderPromise]);
}
