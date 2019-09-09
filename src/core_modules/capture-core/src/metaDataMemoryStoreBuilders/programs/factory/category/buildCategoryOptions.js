// @flow
/* eslint-disable no-await-in-loop */
import { Category } from '../../../../metaData';
import { getUserStorageController } from '../../../../storageControllers';
import { metaDataStores } from '../../../../storageControllers/stores';

async function getCacheOptionsFromKeyAsync(key: string) {
    const storageController = getUserStorageController();
    return storageController.get(metaDataStores.CATEGORY_OPTIONS_BY_CATEGORY, key);
}

async function getCategoryOptions(categoryId: string) {
    const options = [];
    let run = 0;
    let done = false;

    do {
        run += 1;
        const key = run === 1 ? categoryId : `${categoryId}##${run}`;
        const optionsFromKey = await getCacheOptionsFromKeyAsync(key);
        if (optionsFromKey.length > 0) {
            options.push(...optionsFromKey);
        } else {
            done = true;
        }
    } while (!done);

    return options;
}

export async function buildCategoryOptionsAsync(category: Category) {
    return getCategoryOptions(category.id);
}
