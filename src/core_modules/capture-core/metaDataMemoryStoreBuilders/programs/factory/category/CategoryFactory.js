// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    Category,
} from '../../../../metaData';

import type
{
    ProgramCachedCategory,
    CachedCategory,
} from '../../../../storageControllers/cache.types';

export class CategoryFactory {
    cachedCategories: {[categoryId: string]: CachedCategory};
    constructor(cachedCategories: {[categoryId: string]: CachedCategory}) {
        this.cachedCategories = cachedCategories;
    }

    build(
        cachedProgramCategory: ProgramCachedCategory,
    ) {
        return new Category((category: Category) => {
            const id = cachedProgramCategory.id;
            category.id = id;
            const cachedCategory = this.cachedCategories[id];
            if (!cachedCategory) {
                log.error(errorCreator('Could not retrieve cachedCategory')({ id }));
            } else {
                category.name = cachedCategory.displayName;
            }
        });
    }
}
