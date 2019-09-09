/* eslint-disable no-await-in-loop */
// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import chunk from '../../utils/chunk';
import { getApi } from '../../d2/d2Instance';

type InputCategory = {
    id: string,
    displayName: string,
};

type ApiCategoryOption = {
    id: string,
    displayName: string,
    categories: Array<{id: string}>,
    organisationUnits: Array<{id: string}>,
    access: Object,
};

type Specification = {
    modelName: string,
    queryParams: Object,
};

async function requestCategoryOptions(specification: Specification, pageNr: number, pageSize: number) {
    specification.queryParams = {
        ...specification.queryParams,
        page: pageNr,
        pageSize,
    };

    const categoryOptions = await getApi().get(specification.modelName, specification.queryParams)
        .then(response => response && response.categoryOptions);

    return categoryOptions || [];
}

function getOptionsByCategory(categoryOptions: Array<ApiCategoryOption>, requestedCategoryIds: Array<string>) {
    return categoryOptions.reduce((accOptionsByCategory, option) => {
        const optionCategories = option.categories;
        const categories = optionCategories
            .filter(oc => requestedCategoryIds.includes(oc.id));

        accOptionsByCategory = categories.reduce((accOptionsByCategoryInProgress, category) => {
            const currentOptionsForCategory = accOptionsByCategoryInProgress[category.id] || [];
            const organisationUnits = option.organisationUnits;
            currentOptionsForCategory.push({
                id: option.id,
                displayName: option.displayName,
                access: option.access,
                organisationUnitIds: organisationUnits && organisationUnits.length > 0 ?
                    organisationUnits.reduce((accOusAsObject, ou) => {
                        accOusAsObject[ou.id] = true;
                        return accOusAsObject;
                    }, {}) :
                    null,
            });
            accOptionsByCategoryInProgress[category.id] = currentOptionsForCategory;
            return accOptionsByCategoryInProgress;
        }, accOptionsByCategory);
        return accOptionsByCategory;
    }, {});
}

function getCategoryOptionSpec(ids: Array<string>) {
    return {
        modelName: 'categoryOptions',
        queryParams: {
            fields: 'id,displayName,categories, organisationUnits, access[*]',
            filter: [
                `categories.id:in:[${ids.toString()}]`,
                'access.data.read:in:[true]',
            ],
            paging: true,
            totalPages: false,
        },
    };
}

function buildCacheCategoryOptions(
    optionsByCategory: Object,
) {
    const categoriesToStore = Object
        .keys(optionsByCategory)
        .map(key => ({
            id: key,
            options: optionsByCategory[key],
        }));
    return categoriesToStore;
}

function getKey(
    existingKeys: Array<string>,
    id: string,
) {
    let attemptNr = 0;
    let done = false;
    let key;
    while (!done) {
        attemptNr += 1;
        key = attemptNr === 1 ? id : `${id}##${attemptNr}`;
        done = !existingKeys.includes(key);
    }
    return key;
}

async function addToStorageAsync(
    optionsByCategory: Array<Object>,
    storageController: StorageController,
    storeName: string,
) {
    const existingKeys = await storageController.getKeys(storeName);
    const toStore = optionsByCategory
        .map(c => ({
            ...c,
            id: getKey(existingKeys, c.id),
        }));
    await storageController.setAll(storeName, toStore);
}

async function loadCategoryOptionsBatchAsync(
    page: number,
    categoryOptionsSpec: Object,
    categoryIds: Array<string>,
    storageController: StorageController,
    storeName: string,
) {
    const categoryOptions = await requestCategoryOptions(categoryOptionsSpec, page, 10000);
    const optionsByCategory = getOptionsByCategory(categoryOptions, categoryIds);
    const optionsByCategoryToStore = buildCacheCategoryOptions(optionsByCategory);
    await addToStorageAsync(optionsByCategoryToStore, storageController, storeName);

    return categoryOptions.length;
}

// This might look like horrible code!, but there is a reason. Freeing up memory is the most important thing here, ref JIRA-issue DHIS2-7259
async function loadCategoryOptionsInBatchesAsync(
    categoryIds: Array<string>,
    storageController: StorageController,
    storeName: string,
) {
    const categoryOptionsSpec = getCategoryOptionSpec(categoryIds);

    const batchSize = 10000;
    let page = 0;
    let retrievedCount;
    do {
        page += 1;
        retrievedCount =
            await loadCategoryOptionsBatchAsync(page, categoryOptionsSpec, categoryIds, storageController, storeName);
    } while (batchSize === retrievedCount);
}

async function setCategoriesAsync(
    categories: Array<Object>,
    storageController: StorageController,
    storeName: string,
) {
    return storageController.setAll(storeName, categories);
}

export default async function loadCategories(
    storageController: StorageController,
    inputCategories: Array<InputCategory>,
    stores: {
        categories: string,
        categoryOptionsByCategory: string,
    },
) {
    const uniqueCategories = [
        ...new Map(
            inputCategories.map(ic => [ic.id, ic]),
        ).values(),
    ];
    
    await setCategoriesAsync(uniqueCategories, storageController, stores.categories);

    const uniqueCateogryIds = uniqueCategories.map(uc => uc.id);
    const categoryIdBatches = chunk(uniqueCateogryIds, 50);
    await categoryIdBatches
        .asyncForEach(idBatch =>
            loadCategoryOptionsInBatchesAsync(idBatch, storageController, stores.categoryOptionsByCategory));
}
