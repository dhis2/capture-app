/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import type { Icon } from '../Icon/Icon';
import type { CachedAttributeValue } from '../../storageControllers';

export type Value = string | number | boolean | Record<string, unknown>;

export class Option {
    _id!: string;
    _code!: string;
    _value!: Value;
    _text!: string;
    _description?: string;
    _attributeValues?: CachedAttributeValue[];
    _icon?: Icon | undefined;

    constructor(initFn?: (_this: Option) => void) {
        if (initFn && isFunction(initFn)) {
            initFn(this);
        }
    }

    set id(id: string) {
        this._id = id;
    }

    get id(): string {
        return this._id;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    set value(value: Value) {
        this._value = value;
    }

    get value(): Value {
        return this._value;
    }

    set text(text: string) {
        this._text = text;
    }

    get text(): string {
        return this._text;
    }

    set description(description: string | undefined) {
        this._description = description;
    }

    get description(): string | undefined {
        return this._description;
    }

    set icon(icon: Icon | undefined) {
        this._icon = icon;
    }

    get icon(): Icon | undefined {
        return this._icon;
    }

    get attributeValues(): CachedAttributeValue[] | undefined {
        return this._attributeValues;
    }

    set attributeValues(value: CachedAttributeValue[] | undefined) {
        this._attributeValues = value;
    }

    clone(): Option {
        return new Option((cloneObject) => {
            Object
                .getOwnPropertyNames(this)
                .forEach((propName) => {
                    if (propName === '_icon' && this[propName]) {
                        cloneObject.icon = this.icon?.clone();
                    } else {
                        cloneObject[propName] = this[propName];
                    }
                });
        });
    }
}
