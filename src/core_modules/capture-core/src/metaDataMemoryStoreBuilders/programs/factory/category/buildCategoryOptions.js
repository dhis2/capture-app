// @flow
/* eslint-disable no-await-in-loop */
import getStorageController from '../../../../metaDataStores/storageController/metaDataStorageController';
import userStores from '../../../../metaDataStoreLoaders/baseLoader/metaDataObjectStores.const';

type Predicate = (categoryOption: Object) => boolean;
type Project = (caegoryOption: Object) => any;

async function getCategoryOptionIds(categoryId: string) {
    const storageController = getStorageController();
    const storeData = await storageController.get(userStores.CATEGORY_OPTIONS_BY_CATEGORY, categoryId);
    return storeData.options;
}

async function getCategoryOptionsThroughCursor(
    categoryId,
    categoryOptionIds,
    { predicate, project, onIsAborted },
) {
    const internalPredicate = (categoryOption: Object) => {
        const isOptionForCategory = categoryOptionIds[categoryOption.id];
        if (!isOptionForCategory) {
            return false;
        }
        return predicate(categoryOption);
    };

    const storageController = getStorageController();
    const mappedOptions = await storageController.getAll(userStores.CATEGORY_OPTIONS, {
        predicate: internalPredicate,
        project,
        onIsAborted,
        onIDBGetRequest: source => source
            .index('category')
            .openCursor(IDBKeyRange.only(categoryId)),
    });
    return mappedOptions;
}

async function getCategoryOptions(
    categoryId,
    categoryOptionIds,
    callbacks: {
        predicate: Predicate,
        project: Project,
        onIsAborted: Function,
    },
) {
    const mappedOptions = await getCategoryOptionsThroughCursor(categoryId, categoryOptionIds, callbacks);
    return mappedOptions;
}

export async function buildCategoryOptionsAsync(
    categoryId: string,
    callbacks: {
        predicate: Predicate,
        project: Project,
        onIsAborted: Function,
    },
) {
    const categoryOptionIds = await getCategoryOptionIds(categoryId);
    return getCategoryOptions(
        categoryId,
        categoryOptionIds,
        callbacks,
    );
}
