// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';

type Option = {name: string, id: string};

export default class Category {
    _name: ?string;
    _id: ?string;
    _options: ?Array<Option>;

    constructor(initFn: ?(_this: Category) => void) {
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

    get categoryOptions(): ?Array<Option> {
        return this._options;
    }

    set categoryOptions(options: ?Array<Option>) {
        this._options = options;
    }
}
