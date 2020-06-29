// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/lib/isFunction';
import Category from './Category';

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
}
