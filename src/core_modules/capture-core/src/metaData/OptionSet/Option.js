// @flow
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/src/isFunction';
import Icon from '../Icon/Icon';

export type Value = string | number | boolean | {};

export default class Option {
    _value: Value;
    _text: string;
    _description: ?string;
    _icon: ?Icon;

    constructor(initFn?: (_this: Option) => void) {
        initFn && isFunction(initFn) && initFn(this);
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

    set icon(icon: ?Icon) {
        this._icon = icon;
    }
    get icon(): ?Icon {
        return this._icon;
    }
}
