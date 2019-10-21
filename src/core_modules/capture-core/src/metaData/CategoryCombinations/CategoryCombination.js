// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Category from './Category';

export default class CategoryCombination {
    _name: string;
    _id: string;
    _categories: Map<string, Category>;

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

    getCategoryForOptionId(optionId: string) {
        return Array.from(this.categories.values()).find(category => !!category.getOption(optionId));
    }
}
