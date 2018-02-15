// @flow
import buildProgramCollection from '../../metaDataFactory/programFactory';

import getStorageContainer from '../../metaDataMemoryStores/storageContainer/metaDataStorageContainer';
import StorageContainer from '../../storage/StorageContainer';

function getD2Programs(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

function getD2OptionSets(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

function getProgramRulesVariables(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

function getProgramRules(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

async function getBuilderPrerequisites(...storeNames: Array<string>) {
    const storageContainer = getStorageContainer();

    const d2ProgramsPromise = getD2Programs(storageContainer, storeNames[0]);
    const d2OptionSetsPromise = getD2OptionSets(storageContainer, storeNames[1]);
    const d2ProgramRulesVariables = getProgramRulesVariables(storageContainer, storeNames[2]);
    const d2ProgramRules = getProgramRules(storageContainer, storeNames[3]);

    const values = await Promise.all([d2ProgramsPromise, d2OptionSetsPromise, d2ProgramRulesVariables, d2ProgramRules]);
    return values;
}

export default async function buildPrograms(
    locale: string,
    programStoreName: string,
    optionSetStoreName: string,
    programRulesVariablesStoreName: string,
    programRulesStoreName: string) {
    const [d2Programs, d2OptionSets, d2ProgramRulesVariables, d2ProgramRules] =
        await getBuilderPrerequisites(programStoreName, optionSetStoreName, programRulesVariablesStoreName, programRulesStoreName);
    buildProgramCollection(d2Programs, d2OptionSets, d2ProgramRulesVariables, d2ProgramRules, locale);
}
