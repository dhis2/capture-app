// @flow
/* eslint-disable no-await-in-loop */
import { WebWorker } from 'capture-core-utils';
import { MemoryAdapter } from 'capture-core-utils/storage';
import { getUserStorageController, getUserIndexedDbWorker } from '../../../../storageControllers';
import { metaDataStores } from '../../../../storageControllers/stores';

type Predicate = (categoryOption: Object) => boolean;
type Project = (caegoryOption: Object) => any;

const batchSize = 5000;

async function getCategoryOptionIds(categoryId: string) {
    const storageController = getUserStorageController();
    const storeData = await storageController.get(metaDataStores.CATEGORY_OPTIONS_BY_CATEGORY, categoryId);
    return storeData.options;
}

async function getCategoryOptionsThroughCursor(predicate, project, categoryId, categoryOptionIds) {
    const internalPredicate = (categoryOption: Object) => {
        const isOptionForCategory = categoryOptionIds[categoryOption.id];
        if (!isOptionForCategory) {
            return false;
        }
        return predicate(categoryOption);
    };

    const storageController = getUserStorageController();
    const mappedOptions = await storageController.getAll(metaDataStores.CATEGORY_OPTIONS, {
        internalPredicate,
        project,
        onIDBGetRequest: source => source
            .index('category')
            .openCursor(IDBKeyRange.only(categoryId)),
    });
    return mappedOptions;
}

async function getCategoryOptionsThroughBatches(workerOptions: Object) {
    return new Promise((resolve, reject) => {
        const worker = getUserIndexedDbWorker();
        worker.postMessage({ type: 'getCategoryOptionsInBatches', batchSize: 5000, workerOptions });
        worker.addEventListener('message', (event) => {
            const data = event.data;
            if (data.success) {
                resolve(data.records);
            } else {
                reject(data.error);
            }
        });
    });
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

async function getCategoryOptions({
    categoryId,
    categoryOptionIds,
    workerOptions,
    predicate,
    project,
}) {
    if (getUserStorageController().adapterType === MemoryAdapter) {
        return getCategoryOptionsFromMemoryAdapterAsync(categoryOptionIds, predicate, project);
    }

    // const loader = await getLoader(categoryId);
    const loader = getCategoryOptionsThroughCursor;
    const mappedOptions = await (loader === getCategoryOptionsThroughCursor ?
        getCategoryOptionsThroughCursor(predicate, project, categoryId, categoryOptionIds) :
        getCategoryOptionsThroughBatches({ ...workerOptions, categoryOptionIds }));
    return mappedOptions;
}

export async function buildCategoryOptionsAsync(
    categoryId: string,
    callbacks: {
        predicate: Predicate,
        project: Project,
    },
    workerOptions: {
        organisationUnitId: ?string,
    },
) {
    const categoryOptionIds = await getCategoryOptionIds(categoryId);
    return getCategoryOptions({
        categoryId,
        categoryOptionIds,
        workerOptions,
        predicate: callbacks.predicate,
        project: callbacks.project,
    });
}
