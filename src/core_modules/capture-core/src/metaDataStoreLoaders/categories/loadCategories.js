// @flow
import StorageController from 'capture-core-utils/storage/StorageController';
import { ApiSpecification, getterTypes } from '../../api';
import chunk from '../../utils/chunk';

type InputCategory = {
    id: string,
    displayName: string,
};

type ApiCategoryOption = {
    id: string,
    displayName: string,
    categories: {
        toArray: () => Array<{id: string}>,
    },
    organisationUnits: {
        toArray: () => Array<{id: string}>,
    },
    access: Object,
};

async function getCategoryOptionsAsync(
    ids: Array<string>,
): Promise<Array<ApiCategoryOption>> {
    const categoryOptionsApiSpec = new ApiSpecification((_this) => {
        _this.modelName = 'categoryOptions';
        _this.modelGetterType = getterTypes.LIST_WITH_PAGER;
        _this.queryParams = {
            fields: 'id,displayName,categories, organisationUnits, access[*]',
            paging: true,
            pageSize: 10000,
        };
    });
    categoryOptionsApiSpec.setFilter(`categories.id:in:[${ids.toString()}]`);
    categoryOptionsApiSpec.setFilter('access.data.read:in:[true]');
    // $FlowFixMe
    const categoryOptionsContainer = await categoryOptionsApiSpec.get();
    let categoryOptions = [...categoryOptionsContainer.values()];

    // $FlowFixMe
    const pagePromises = [];
    const pageCount = categoryOptionsContainer.pager.pageCount;
    for (let currentPage = categoryOptionsContainer.pager.page + 1; currentPage <= pageCount; currentPage++) {
        categoryOptionsApiSpec.updateQueryParams({ page: currentPage });
        pagePromises.push(categoryOptionsApiSpec.get());
    }

    categoryOptions = (await Promise
        .all(pagePromises))
        .reduce((accCategoryOptions, pageData) => {
            pageData.values && categoryOptions.push(...pageData.values());
            return categoryOptions;
        }, categoryOptions);
    return categoryOptions || [];
}

function getOptionsByCategory(categoryOptionsBatches: Array<Array<ApiCategoryOption>>) {
    return categoryOptionsBatches.reduce((accOptionsByCategory, batchArray) =>
        batchArray.reduce((accOptionsByCategoryForBatch, option) => {
            const categories = option.categories.toArray();
            accOptionsByCategoryForBatch = categories.reduce((accOptionsByCategoryForBatchInProgress, category) => {
                const currentOptionsForCategory = accOptionsByCategoryForBatchInProgress[category.id] || new Map();
                const organisationUnits = option.organisationUnits ? option.organisationUnits.toArray() : [];
                accOptionsByCategoryForBatchInProgress[category.id] = currentOptionsForCategory.set(option.id, {
                    id: option.id,
                    displayName: option.displayName,
                    access: option.access,
                    organisationUnitIds: organisationUnits && organisationUnits.length > 0 ?
                        organisationUnits.map(ou => ou.id) :
                        null,
                });
                return accOptionsByCategoryForBatchInProgress;
            }, accOptionsByCategoryForBatch);
            return accOptionsByCategoryForBatch;
        }, accOptionsByCategory), {});
}

function buildCacheCategories(
    uniqueCategories: Array<InputCategory>,
    optionsByCategory: Object,
) {
    const categoriesToStore = uniqueCategories
        .map(category => ({
            id: category.id,
            displayName: category.displayName,
            categoryOptions: optionsByCategory[category.id] ? [...optionsByCategory[category.id].values()] : [],
        }));
    return categoriesToStore;
}

export default async function loadCategories(
    storageController: StorageController,
    store: string,
    inputCategories: Array<InputCategory>,
) {
    const uniqueCategories = [
        ...new Map(
            inputCategories.map(ic => [ic.id, ic]),
        ).values(),
    ];

    const uniqueCateogryIds = uniqueCategories.map(uc => uc.id);
    const categoryIdBatches = chunk(uniqueCateogryIds, 50);
    const categoryOptionsBatches = await Promise.all(
        categoryIdBatches
            .map(batch => getCategoryOptionsAsync(batch)),
    );

    const optionsByCategory = getOptionsByCategory(categoryOptionsBatches);
    const categoriesToStore = buildCacheCategories(uniqueCategories, optionsByCategory);
    await storageController.setAll(store, categoriesToStore);
}
