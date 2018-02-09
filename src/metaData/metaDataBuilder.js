// @flow
import buildProgramCollection from 'capture-core/metaDataFactory/metaDataFactory';
import StorageContainer from 'capture-core/storage/StorageContainer';

import getStorageContainer from './metaDataStorageContainer';
import stores from './metaDataObjectStores.const';

function getD2Programs(storageContainer: StorageContainer): Promise<Array<Object>> {
    return storageContainer.getAll(stores.PROGRAMS);
}

function getD2OptionSets(storageContainer: StorageContainer): Promise<Array<Object>> {
    return storageContainer.getAll(stores.OPTION_SETS);
}

function getProgramRulesVariables(storageContainer: StorageContainer): Promise<Array<Object>> {
    return storageContainer.getAll(stores.PROGRAM_RULES_VARIABLES);
}

function getProgramRules(storageContainer: StorageContainer): Promise<Array<Object>> {
    return storageContainer.getAll(stores.PROGRAM_RULES);
}

async function getBuilderPrerequisites() {
    const storageContainer = getStorageContainer();
    
    const d2ProgramsPromise = getD2Programs(storageContainer);
    const d2OptionSetsPromise = getD2OptionSets(storageContainer);
    const d2ProgramRulesVariables = getProgramRulesVariables(storageContainer);
    const d2ProgramRules = getProgramRules(storageContainer);

    const values = await Promise.all([d2ProgramsPromise, d2OptionSetsPromise, d2ProgramRulesVariables, d2ProgramRules]);
    return values;
}

export default async function buildMetaData(locale: string) {
    const [d2Programs, d2OptionSets, d2ProgramRulesVariables, d2ProgramRules] = await getBuilderPrerequisites();
    buildProgramCollection(d2Programs, d2OptionSets, d2ProgramRulesVariables, d2ProgramRules, locale);
}
