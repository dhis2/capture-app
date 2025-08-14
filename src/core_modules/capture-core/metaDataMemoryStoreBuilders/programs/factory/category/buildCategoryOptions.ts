/* eslint-disable no-await-in-loop */
import { MemoryAdapter } from 'capture-core-utils/storage';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../storageControllers';

type Predicate = (categoryOption: any) => boolean;
type Project = (caegoryOption: any) => any;

async function getCategoryOptionIds(categoryId: string) {
    const storageController = getUserMetadataStorageController();
    const storeData = await storageController.get(USER_METADATA_STORES.CATEGORY_OPTIONS_BY_CATEGORY, categoryId);
    return storeData.options;
}

async function getCategoryOptionsThroughCursor(
    categoryId,
    categoryOptionIds,
    { predicate, project, onIsAborted },
) {
    const internalPredicate = (categoryOption: any) => {
        const isOptionForCategory = categoryOptionIds[categoryOption.id];
        if (!isOptionForCategory) {
            return false;
        }
        return predicate(categoryOption);
    };

    const storageController = getUserMetadataStorageController();
    const mappedOptions = await storageController.getAll(USER_METADATA_STORES.CATEGORY_OPTIONS, {
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
    categoryOptionIds: any,
    predicate: Predicate,
    project: Project,
) {
    const storageController = getUserMetadataStorageController();
    const optionPromises = categoryOptionIds
        .map(id => storageController
            .get(USER_METADATA_STORES.CATEGORY_OPTIONS, id)
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
    if (getUserMetadataStorageController().adapterType === MemoryAdapter) {
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
