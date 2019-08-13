// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import { errorCreator } from 'capture-core-utils';
import CategoryOption from './CategoryOption';

export default class Category {
    _name: string;
    _id: string;
    _options: Map<string, CategoryOption>;

    static errorMessages = {
        CATEGORY_OPTION_NOT_FOUND: 'Category option was not found',
    };

    constructor(initFn: ?(_this: Category) => void) {
        this.name = '';
        this.id = '';
        this._options = new Map();
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

    get categoryOptions(): Map<string, CategoryOption> {
        return this._options;
    }

    set categoryOptions(options: Map<string, CategoryOption>) {
        this._options = options;
    }

    getOptionThrowIfNotFound(id: string): CategoryOption {
        const option = this.categoryOptions.get(id);
        if (!option) {
            throw new Error(
                errorCreator(Category.errorMessages.CATEGORY_OPTION_NOT_FOUND)({ category: this, categoryOptionId: id }),
            );
        }
        return option;
    }

    getOption(optionId: string): ?CategoryOption {
        return this.categoryOptions.get(optionId);
    }
}
