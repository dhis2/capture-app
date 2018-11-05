// @flow
import buildProgramCollection from '../../metaDataFactory/program/programFactory';

import getStorageContainer from '../../metaDataMemoryStores/storageContainer/metaDataStorageContainer';
import StorageContainer from '../../storage/StorageContainer';

function getPrograms(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

function getOptionSets(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

function getProgramRulesVariables(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

function getProgramRules(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

function getProgramIndicators(storageContainer: StorageContainer, storeName: string): Promise<Array<Object>> {
    return storageContainer.getAll(storeName);
}

async function getBuilderPrerequisites(...storeNames: Array<string>) {
    const storageContainer = getStorageContainer();

    const cachedProgramsPromise = getPrograms(storageContainer, storeNames[0]);
    const cachedOptionSetsPromise = getOptionSets(storageContainer, storeNames[1]);
    const cachedProgramRulesVariables = getProgramRulesVariables(storageContainer, storeNames[2]);
    const cachedProgramRules = getProgramRules(storageContainer, storeNames[3]);
    const cachedProgramIndicatorsPromise = getProgramIndicators(storageContainer, storeNames[4]);

    const values = await Promise.all([cachedProgramsPromise, cachedOptionSetsPromise, cachedProgramRulesVariables, cachedProgramRules, cachedProgramIndicatorsPromise]);
    return values;
}

export default async function buildPrograms(
    locale: string,
    programStoreName: string,
    optionSetStoreName: string,
    programRulesVariablesStoreName: string,
    programRulesStoreName: string,
    programIndicatorsStoreName: string) {
    const [cachedPrograms, cachedOptionSets, cachedProgramRulesVariables, cachedProgramRules, cachedProgramIndicators] =
        await getBuilderPrerequisites(
            programStoreName,
            optionSetStoreName,
            programRulesVariablesStoreName,
            programRulesStoreName,
            programIndicatorsStoreName,
        );

    await buildProgramCollection(
        cachedPrograms,
        cachedOptionSets,
        cachedProgramRulesVariables,
        cachedProgramRules,
        cachedProgramIndicators,
        locale,
    );
}
