// @flow
/* eslint-disable no-await-in-loop */
import { MemoryAdapter } from 'capture-core-utils/storage';
import { getUserStorageController } from '../../../../storageControllers';
import { metaDataStores } from '../../../../storageControllers/stores';

type Predicate = (categoryOption: Object) => boolean;
type Project = (caegoryOption: Object) => any;

const batchSize = 5000;

async function getCategoryOptionIds(categoryId: string) {
    const storageController = getUserStorageController();
    const storeData = await storageController.get(metaDataStores.CATEGORY_OPTIONS_BY_CATEGORY, categoryId);
    return storeData.options;
}

async function getCategoryOptionsThroughCursor(predicate, project, categoryId) {
    const storageController = getUserStorageController();
    const mappedOptions = await storageController.getAll(metaDataStores.CATEGORY_OPTIONS, {
        predicate,
        project,
        onIDBGetRequest: source => source
            .index('category')
            .openCursor(IDBKeyRange.only(categoryId)),
    });
    return mappedOptions;
}

async function getCategoryOptionsThroughBatches(predicate, project) {
    const storageController = getUserStorageController();
    const mappedOptions = await storageController.getAll(metaDataStores.CATEGORY_OPTIONS, {
        predicate,
        project,
        batchSize,
    });
    return mappedOptions;
}

async function getLoader(categoryId: string) {
    const storageController = getUserStorageController();
    const totalCount = await storageController.count(metaDataStores.CATEGORY_OPTIONS);
    const currentCategoryCount = await storageController.count(metaDataStores.CATEGORY_OPTIONS, {
        onIDBGetRequest: objectStore => objectStore
            .index('category')
            .count(IDBKeyRange.only(categoryId)),
    });

    if (currentCategoryCount > batchSize) {
        if ((currentCategoryCount / totalCount) > 0.5) {
            return getCategoryOptionsThroughBatches;
        }
    }

    return getCategoryOptionsThroughCursor;
}

function getCategoryOptionsFromMemoryAdapterAsync(
    categoryOptionIds: Object,
    predicate: Predicate,
    project: Project,
) {
    const storageController = getUserStorageController();
    const optionPromises = categoryOptionIds
        .map(id => storageController
            .get(metaDataStores.CATEGORY_OPTIONS, id)
            .then(co =>
                (predicate(co) ? project(co) : null)),
        );

    return Promise
        .all(optionPromises)
        .then(options => options.filter(o => o));
}

async function getCategoryOptions(
    categoryId: string,
    categoryOptionIds: Object,
    predicate: Predicate,
    project: Project,
) {
    if (getUserStorageController().adapterType === MemoryAdapter) {
        return getCategoryOptionsFromMemoryAdapterAsync(categoryOptionIds, predicate, project);
    }

    const internalPredicate = (categoryOption: Object) => {
        const isOptionForCategory = categoryOptionIds[categoryOption.id];
        if (!isOptionForCategory) {
            return false;
        }
        return predicate(categoryOption);
    };

    const loader = await getLoader(categoryId);
    // const loader = getCategoryOptionsThroughCursor;
    const mappedOptions = await loader(internalPredicate, project, categoryId);
    return mappedOptions;
}

export async function buildCategoryOptionsAsync(categoryId: string, predicate: Predicate, project: Project) {
    const categoryOptionIds = await getCategoryOptionIds(categoryId);
    return getCategoryOptions(categoryId, categoryOptionIds, predicate, project);
}
