/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';

export type Value = string | number | boolean | Record<string, unknown>;

export class OptionGroup {
    private _id!: string;
    private _optionIds!: Map<string, string>;

    constructor(initFn?: (_this: OptionGroup) => void) {
        initFn && isFunction(initFn) && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    set optionIds(optionIds: Map<string, string>) {
        this._optionIds = optionIds;
    }

    get optionIds(): Map<string, string> {
        return this._optionIds;
    }
}
