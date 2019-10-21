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
    categories: Array<string>,
    organisationUnits: Array<string>,
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

    const categoryOptions = await getApi().get(specification.modelName, { ...specification.queryParams })
        .then(response => response && response.categoryOptions);
    return categoryOptions || [];
}

function addOptionsByCategory(
    categoryOptions: Array<ApiCategoryOption>,
    requestedCategoryIds: Array<string>,
    prevOptionsByCategory: Object,
) {
    return categoryOptions.reduce((accOptionsByCategory, option) => {
        const optionCategoryIds = option.categories;
        const categoryIds = optionCategoryIds
            .filter(ocId => requestedCategoryIds.includes(ocId));

        accOptionsByCategory = categoryIds.reduce((accOptionsByCategoryInProgress, categoryId) => {
            const currentOptionsForCategory = accOptionsByCategoryInProgress[categoryId] || {};
            currentOptionsForCategory[option.id] = true;
            accOptionsByCategoryInProgress[categoryId] = currentOptionsForCategory;
            return accOptionsByCategoryInProgress;
        }, accOptionsByCategory);
        return accOptionsByCategory;
    }, prevOptionsByCategory);
}

function getCategoryOptionSpec(ids: Array<string>) {
    return {
        modelName: 'categoryOptions',
        queryParams: {
            fields: 'id,displayName,categories~pluck, organisationUnits~pluck, access[*]',
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
    categoryOptions: Array<Object>,
) {
    return categoryOptions
        .map((co) => {
            const organisationUnitsObject = co.organisationUnits && co.organisationUnits.length > 0 ?
                co.organisationUnits.reduce((acc, orgUnitId) => {
                    acc[orgUnitId] = true;
                    return acc;
                }, {}) : null;
            co.organisationUnits = organisationUnitsObject;
            return co;
        });
}

async function loadCategoryOptionsBatchAsync(
    page: number,
    categoryOptionsSpec: Object,
    categoryIds: Array<string>,
    bachSize: number,
    storageController: StorageController,
    storeName: string,
    prevOptionsByCategory: Object,
) {
    const categoryOptions = await requestCategoryOptions(categoryOptionsSpec, page, bachSize);
    const optionsByCategory = addOptionsByCategory(categoryOptions, categoryIds, prevOptionsByCategory);
    const categoryOptionsToStore = buildCacheCategoryOptions(categoryOptions);
    await storageController.setAll(storeName, categoryOptionsToStore);

    return {
        retrievedCount: categoryOptions.length,
        optionsByCategory,
    };
}

// This might look like horrible code!, but there is a reason. Freeing up memory is the most important thing here, ref JIRA-issue DHIS2-7259
async function loadCategoryOptionsInBatchesAsync(
    categoryIds: Array<string>,
    storageController: StorageController,
    stores: {
        categoryOptionsByCategory: string,
        categoryOptions: string,
    },
) {
    const categoryOptionsSpec = getCategoryOptionSpec(categoryIds);

    const batchSize = 5000;
    let page = 0;
    let retrievedCount;
    let optionsByCategory = {};
    do {
        page += 1;
        ({ retrievedCount, optionsByCategory } =
            await loadCategoryOptionsBatchAsync(
                page,
                categoryOptionsSpec,
                categoryIds,
                batchSize,
                storageController,
                stores.categoryOptions,
                optionsByCategory,
            ));
    } while (batchSize === retrievedCount);

    // save optionsByCategory
    const optionsByCategoryToStore = Object
        .keys(optionsByCategory)
        .map(cId => ({
            id: cId,
            options: optionsByCategory[cId],
        }));
    await storageController.setAll(stores.categoryOptionsByCategory, optionsByCategoryToStore);
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
        categoryOptions: string,
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
            loadCategoryOptionsInBatchesAsync(idBatch, storageController, {
                categoryOptionsByCategory: stores.categoryOptionsByCategory,
                categoryOptions: stores.categoryOptions,
            }));
}
