// @flow
import StorageController from '../../storage/StorageController';
import ApiSpecification from '../../api/ApiSpecificationDefinition/ApiSpecification';
import getterTypes from '../../api/fetcher/getterTypes.const';
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
};

async function requestCategoryOptions(specification: ApiSpecification, pageNr: number, pageSize: number) {
    specification.updateQueryParams({ page: pageNr, pageSize });

    const categoryOptionsContainer = await specification.get();
    const categoryOptions = categoryOptionsContainer && [...categoryOptionsContainer.values()];

    if (categoryOptions && categoryOptions.length === pageSize) {
        const categoryOptionsFromPageHierarchy = await requestCategoryOptions(specification, pageNr += 1, pageSize);
        return [...categoryOptions, ...categoryOptionsFromPageHierarchy];
    }

    return categoryOptions || [];
}

async function getCategoryOptionsAsync(
    ids: Array<string>,
): Promise<Array<ApiCategoryOption>> {
    const categoryOptionsApiSpec = new ApiSpecification((_this) => {
        _this.modelName = 'categoryOptions';
        _this.modelGetterType = getterTypes.LIST_WITH_PAGER;
        _this.queryParams = {
            fields: 'id,displayName,categories, organisationUnits',
            paging: true,
            totalPages: false,
        };
    });
    categoryOptionsApiSpec.setFilter(`categories.id:in:[${ids.toString()}]`);
    categoryOptionsApiSpec.setFilter('access.data.read:in:[true]');
    const categoryOptions = await requestCategoryOptions(categoryOptionsApiSpec, 1, 10000);
    return categoryOptions;
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
                    organisationUnitIds: organisationUnits && organisationUnits.length > 0 ?
                        organisationUnits.reduce((accOusAsObject, ou) => {
                            accOusAsObject[ou.id] = true;
                            return accOusAsObject;
                        }, {}) :
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
