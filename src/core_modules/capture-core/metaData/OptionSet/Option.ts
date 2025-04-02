/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import type { Icon } from '../Icon/Icon';
import type { CachedAttributeValue } from '../../storageControllers';

export type Value = string | number | boolean | Record<string, unknown>;

export class Option {
    private _id!: string;
    private _code!: string;
    private _value!: Value;
    private _text!: string;
    private _description?: string;
    private _attributeValues?: CachedAttributeValue[];
    private _icon?: Icon;

    constructor(initFn?: (this: Option) => void) {
        if (initFn && isFunction(initFn)) {
            initFn.call(this);
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
        // @ts-expect-error - We know these properties exist on the object
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
