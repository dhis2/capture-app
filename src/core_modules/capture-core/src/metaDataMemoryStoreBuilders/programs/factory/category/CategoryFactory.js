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

class CategoryFactory {
    cachedCategories: {[categoryId: string]: CachedCategory};
    constructor(cachedCategories: {[categoryId: string]: CachedCategory}) {
        this.cachedCategories = cachedCategories;
    }

    build(
        cachedProgramCategory: ProgramCachedCategory,
    ) {
        return new Category((_this) => {
            const id = cachedProgramCategory.id;
            _this.id = id;
            const cachedCategory = this.cachedCategories[id];
            if (!cachedCategory) {
                log.error(errorCreator('Could not retrieve cachedCategory')({ id }));
            } else {
                _this.name = cachedCategory.displayName;
            }
        });
    }
}

export default CategoryFactory;
