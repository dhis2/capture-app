// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import Category from './Category';

export default class CategoryCombination {
    _name: ?string;
    _id: ?string;
    _categories: ?Array<Category>;

    constructor(initFn: ?(_this: CategoryCombination) => void) {
        initFn && isFunction(initFn) && initFn(this);
    }

    get name(): ?string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get id(): ?string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get categories(): ?Array<Category> {
        return this._categories;
    }

    set categories(categories: ?Array<Category>) {
        this._categories = categories;
    }
}
