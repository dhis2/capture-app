// @flow
/* eslint-disable no-await-in-loop */
import { MemoryAdapter } from 'capture-core-utils/storage';
import { getUserStorageController } from '../../../../storageControllers';
import { userStores } from '../../../../storageControllers/stores';

type Predicate = (categoryOption: Object) => boolean;
type Project = (caegoryOption: Object) => any;

async function getCategoryOptionIds(categoryId: string) {
    const storageController = getUserStorageController();
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

    const storageController = getUserStorageController();
    const mappedOptions = await storageController.getAll(userStores.CATEGORY_OPTIONS, {
        predicate: internalPredicate,
        project,
        onIsAborted,
        onIDBGetRequest: source => source
            .index('categoryId')
            .openCursor(IDBKeyRange.only(categoryId)),
    });
    return mappedOptions;
}

function getCategoryOptionsFromMemoryAdapterAsync(
    categoryOptionIds: Object,
    predicate: Predicate,
    project: Project,
) {
    const storageController = getUserStorageController();
    const optionPromises = categoryOptionIds
        .map(id => storageController
            .get(userStores.CATEGORY_OPTIONS, id)
            .then(co =>
                (predicate(co) ? project(co) : null)),
        );

    return Promise
        .all(optionPromises)
        .then(options => options.filter(o => o));
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
    const { predicate, project } = callbacks;
    if (getUserStorageController().adapterType === MemoryAdapter) {
        return getCategoryOptionsFromMemoryAdapterAsync(categoryOptionIds, predicate, project);
    }
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
