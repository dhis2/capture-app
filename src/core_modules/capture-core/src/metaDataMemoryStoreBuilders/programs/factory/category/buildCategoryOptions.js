// @flow
/* eslint-disable no-await-in-loop */
import { getUserStorageController } from '../../../../storageControllers';
import { metaDataStores } from '../../../../storageControllers/stores';

type Predicate = (categoryOption: Object) => boolean;
type Project = (caegoryOption: Object) => any;

async function getCategoryOptionIds(categoryId: string) {
    const storageController = getUserStorageController();
    const storeData = await storageController.get(metaDataStores.CATEGORY_OPTIONS_BY_CATEGORY, categoryId);
    return storeData.options;
}
async function getCategoryOptions(
    categoryId: string,
    categoryOptionIds: Object,
    onFilter: Predicate,
    onMap: Project,
) {
    const predicate = (categoryOption: Object) => {
        const isOptionForCategory = categoryOptionIds[categoryOption.id];
        if (!isOptionForCategory) {
            return false;
        }

        return onFilter(categoryOption);
    };

    const storageController = getUserStorageController();
    const mappedOptions = await storageController.getAll(metaDataStores.CATEGORY_OPTIONS, {
        predicate,
        project: onMap,
        onIDBGetRequest: (source) => {
            debugger;
            return source
                .index('category')
                .openCursor(IDBKeyRange.only(categoryId));
        },
    });
    return mappedOptions;
}

export async function buildCategoryOptionsAsync(categoryId: string, onFilter: Predicate, onMap: Project) {
    const categoryOptionIds = await getCategoryOptionIds(categoryId);
    return getCategoryOptions(categoryId, categoryOptionIds, onFilter, onMap);
}
