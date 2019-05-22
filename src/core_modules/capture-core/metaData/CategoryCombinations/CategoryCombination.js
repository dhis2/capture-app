// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Category from './Category';
import errorCreator from '../../utils/errorCreator';

export default class CategoryCombination {
    _name: string;
    _id: string;
    _categories: Map<string, Category>;

    static errorMessages = {
        CATEGORY_NOT_FOUND: 'Category was not found',
    };

    constructor(initFn: ?(_this: CategoryCombination) => void) {
        this.name = '';
        this.id = '';
        this.categories = new Map();
        initFn && isFunction(initFn) && initFn(this);
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get categories(): Map<string, Category> {
        return this._categories;
    }

    set categories(categories: Map<string, Category>) {
        this._categories = categories;
    }

    getCategoryThrowIfNotFound(id: string): Category {
        const category = this.categories.get(id);
        if (!category) {
            throw new Error(
                errorCreator(CategoryCombination.errorMessages.CATEGORY_NOT_FOUND)({ categoryCombination: this, categoryId: id }),
            );
        }
        return category;
    }

    getCategoryForOptionId(optionId: string) {
        return Array.from(this.categories.values()).find(category => !!category.getOption(optionId));
    }
}
