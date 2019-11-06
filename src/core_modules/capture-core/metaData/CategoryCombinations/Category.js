// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/src/isFunction';

export default class Category {
    _name: string;
    _id: string;

    static errorMessages = {
        CATEGORY_OPTION_NOT_FOUND: 'Category option was not found',
    };

    constructor(initFn: ?(_this: Category) => void) {
        this.name = '';
        this.id = '';
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
}
