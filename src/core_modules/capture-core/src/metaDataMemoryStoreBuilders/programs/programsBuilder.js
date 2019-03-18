// @flow
import buildProgramCollection from '../../metaDataFactory/program/programFactory';

import getStorageController from '../../metaDataStores/storageController/metaDataStorageController';
import StorageController from '../../storage/StorageController';

function getPrograms(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getOptionSets(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramRulesVariables(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramRules(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getProgramIndicators(storageController: StorageController, storeName: string): Promise<Array<Object>> {
    return storageController.getAll(storeName);
}

function getCategories(
    storageController: StorageController,
    storeName: string,
): Promise<Object> {
    return storageController.getAll(storeName)
        .then(categoryArray => categoryArray.reduce((accCategories, category) => {
            accCategories[category.id] = category;
            return accCategories;
        }, {}));
}

async function getBuilderPrerequisites(...storeNames: Array<string>) {
    const storageController = getStorageController();

    const cachedProgramsPromise = getPrograms(storageController, storeNames[0]);
    const cachedOptionSetsPromise = getOptionSets(storageController, storeNames[1]);
    const cachedProgramRulesVariables = getProgramRulesVariables(storageController, storeNames[2]);
    const cachedProgramRules = getProgramRules(storageController, storeNames[3]);
    const cachedProgramIndicatorsPromise = getProgramIndicators(storageController, storeNames[4]);
    const cachedCategoriesPromise = getCategories(storageController, storeNames[5]);

    const values =
        await Promise.all([
            cachedProgramsPromise,
            cachedOptionSetsPromise,
            cachedProgramRulesVariables,
            cachedProgramRules,
            cachedProgramIndicatorsPromise,
            cachedCategoriesPromise,
        ]);
    return values;
}

export default async function buildPrograms(
    locale: string,
    programStoreName: string,
    optionSetStoreName: string,
    programRulesVariablesStoreName: string,
    programRulesStoreName: string,
    programIndicatorsStoreName: string,
    categoriesStoreName: string,
) {
    const [cachedPrograms, cachedOptionSets, cachedProgramRulesVariables, cachedProgramRules, cachedProgramIndicators, cachedCategories] =
        await getBuilderPrerequisites(
            programStoreName,
            optionSetStoreName,
            programRulesVariablesStoreName,
            programRulesStoreName,
            programIndicatorsStoreName,
            categoriesStoreName,
        );

    await buildProgramCollection(
        cachedPrograms,
        cachedOptionSets,
        cachedProgramRulesVariables,
        cachedProgramRules,
        cachedProgramIndicators,
        cachedCategories,
        locale,
    );
}
