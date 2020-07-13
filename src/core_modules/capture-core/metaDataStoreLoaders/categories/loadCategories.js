/* eslint-disable no-await-in-loop */
// @flow
import { chunk } from 'capture-core-utils';
import { getContext } from '../context';
import { query } from '../IOUtils';

type QueryVariables = {
    page: number,
    pageSize: number,
};

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

async function requestCategoryOptions(querySpec: Object, page: number, pageSize: number) {
    const response = await query(querySpec, { page, pageSize });
    return {
        hasNextPage: !!(response && response.pager && response.pager.nextPage),
        categoryOptions: (response && response.categoryOptions) || [],
    };
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

function getCategoryOptionQuery(categoryIds: Array<string>) {
    return {
        resource: 'categoryOptions',
        params: (variables: QueryVariables) => ({
            fields: 'id,displayName,categories~pluck, organisationUnits~pluck, access[*]',
            filter: [
                `categories.id:in:[${categoryIds.join(',')}]`,
                'access.data.read:in:[true]',
            ],
            page: variables.page,
            pageSize: variables.pageSize,
        }),
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
    categoryOptionsQuery: Object,
    categoryIds: Array<string>,
    batchSize: number,
    prevOptionsByCategory: Object,
) {
    const { categoryOptions, hasNextPage } = await requestCategoryOptions(categoryOptionsQuery, page, batchSize);
    const optionsByCategory = addOptionsByCategory(categoryOptions, categoryIds, prevOptionsByCategory);
    const categoryOptionsToStore = buildCacheCategoryOptions(categoryOptions);

    const { storageController, storeNames } = getContext();
    await storageController.setAll(storeNames.CATEGORY_OPTIONS, categoryOptionsToStore);

    return {
        hasNextPage,
        optionsByCategory,
    };
}

async function loadCategoryOptionsInBatchesAsync(categoryIds: Array<string>) {
    const categoryOptionsQuery = getCategoryOptionQuery(categoryIds);

    const batchSize = 5000;
    let page = 0;
    let hasNextPage;
    let optionsByCategory = {};
    do {
        page += 1;
        ({ hasNextPage, optionsByCategory } =
            await loadCategoryOptionsBatchAsync(
                page,
                categoryOptionsQuery,
                categoryIds,
                batchSize,
                optionsByCategory,
            ));
    } while (hasNextPage);

    // save optionsByCategory
    const { storageController, storeNames } = getContext();
    const optionsByCategoryToStore = Object
        .keys(optionsByCategory)
        .map(cId => ({
            id: cId,
            options: optionsByCategory[cId],
        }));
    await storageController.setAll(storeNames.CATEGORY_OPTIONS_BY_CATEGORY, optionsByCategoryToStore);
}

async function setCategoriesAsync(
    categories: Array<Object>,
) {
    const { storageController, storeNames } = getContext();
    return storageController.setAll(storeNames.CATEGORIES, categories);
}

/**
 * Retrieve and store categories and the underlying category options based on the unique categories argument.
 * The unique categories input is determined from the stale programs (programs where the program version has changed).
 * We chunk the categories in chunks of smaller sizes in order to comply with a potential url path limit and
 * to improve performance, mainly by reducing memory consumption on both the client and the server.
 */
export async function loadCategories(
    uniqueCategories: Array<InputCategory>,
) {
    await setCategoriesAsync(uniqueCategories);

    const uniqueCategoryIds = uniqueCategories.map(uc => uc.id);
    const categoryIdBatches = chunk(uniqueCategoryIds, 50);
    await categoryIdBatches
        // $FlowFixMe[prop-missing] automated comment
        .asyncForEach(idBatch => loadCategoryOptionsInBatchesAsync(idBatch));
}
