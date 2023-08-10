// @flow
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import type { Icon } from '../Icon/Icon';
import type { CachedAttributeValue } from '../../storageControllers';

export type Value = string | number | boolean | {};

export class Option {
    _id: string;
    _code: string;
    _value: Value;
    _text: string;
    _description: ?string;
    _attributeValues: ?Array<CachedAttributeValue>;
    _icon: Icon | void;

    constructor(initFn?: (_this: Option) => void) {
        initFn && isFunction(initFn) && initFn(this);
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

    set description(description: ?string) {
        this._description = description;
    }
    get description(): ?string {
        return this._description;
    }

    set icon(icon?: Icon) {
        this._icon = icon;
    }

    get icon(): Icon | void {
        return this._icon;
    }

    get attributeValues(): ?Array<CachedAttributeValue> {
        return this._attributeValues;
    }

    set attributeValues(value: ?Array<CachedAttributeValue>) {
        this._attributeValues = value;
    }

    clone() {
        return new Option((cloneObject) => {
            Object
                .getOwnPropertyNames(this)
                .forEach((propName) => {
                    // $FlowFixMe
                    if (propName === '_icon' && this[propName]) {
                        // $FlowFixMe
                        cloneObject.icon = this.icon.clone();
                    } else {
                        // $FlowFixMe
                        cloneObject[propName] = this[propName];
                    }
                });
        });
    }
}
