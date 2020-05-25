// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import log from 'loglevel';
import isFunction from 'd2-utilizr/lib/isFunction';
import isArray from 'd2-utilizr/lib/isArray';

import Icon from '../Icon/Icon';
import OptionSet from '../OptionSet/OptionSet';
import { errorCreator } from 'capture-core-utils';
import elementTypes from './elementTypes';
import { Unique } from './Unique';

export default class DataElement {
    static errorMessages = {
        TYPE_NOT_FOUND: 'type not supported',
    };

    _id: string;
    _name: string;
    _shortName: string;
    _formName: string;
    _disabled: boolean;
    _compulsory: boolean;
    _description: string;
    _type: $Values<typeof elementTypes>;
    _optionSet: ?OptionSet;
    _displayInForms: boolean;
    _displayInReports: boolean;
    _icon: ?Icon;
    _unique: ?Unique;

    constructor(initFn: ?(_this: DataElement) => void) {
        this._displayInReports = true;
        this._displayInForms = true;
        this.disabled = false;
        this.compulsory = false;
        initFn && isFunction(initFn) && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    set shortName(shortName: string) {
        this._shortName = shortName;
    }
    get shortName(): string {
        return this._shortName;
    }

    set formName(formName: string) {
        this._formName = formName;
    }
    get formName(): string {
        return this._formName;
    }

    set displayInForms(display?: ?boolean) {
        this._displayInForms = display != null ? display : true;
    }
    get displayInForms(): boolean {
        return this._displayInForms;
    }

    set displayInReports(display?: ?boolean) {
        this._displayInReports = display != null ? display : true;
    }
    get displayInReports(): boolean {
        return this._displayInReports;
    }

    set disabled(disabled: ?boolean) {
        this._disabled = !!disabled;
    }
    get disabled(): boolean {
        return this._disabled;
    }

    set compulsory(compulsory: ?boolean) {
        this._compulsory = !!compulsory;
    }
    get compulsory(): boolean {
        return this._compulsory;
    }

    set description(description: string) {
        this._description = description;
    }
    get description(): string {
        return this._description;
    }

    set type(type: string) {
        if (!elementTypes[type]) {
            log.warn(errorCreator(DataElement.errorMessages.TYPE_NOT_FOUND)({ dataElement: this, type }));
            this._type = elementTypes.UNKNOWN;
        } else {
            this._type = type;
        }
    }
    get type(): $Values<typeof elementTypes> {
        return this._type;
    }

    set optionSet(optionSet: ?OptionSet) {
        this._optionSet = optionSet;
    }
    get optionSet(): ?OptionSet {
        return this._optionSet;
    }

    set icon(icon: ?Icon) {
        this._icon = icon;
    }
    get icon(): ?Icon {
        return this._icon;
    }

    set unique(unique: Unique) {
        this._unique = unique;
    }
    get unique(): ?Unique {
        return this._unique;
    }

    * getPropertyNames(): Generator<string, void, void> {
        const excluded = ['getPropertyNames', 'constructor', 'copyPropertiesTo', 'getConvertedOptionSet', 'convertValue'];
        for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (!excluded.includes(name)) {
                yield name;
            }
        }
    }

    copyPropertiesTo(object: {}) {
        for (const propName of this.getPropertyNames()) {
            // $FlowSuppress
            object[propName] = this[propName];
        }
        return object;
    }

    getConvertedOptionSet(onConvert: ?ConvertFn): ?OptionSet {
        if (this.optionSet) {
            const currentOptions = [...this.optionSet.options];
            const convertedOptionSet = new OptionSet(this.optionSet.id, currentOptions, null, this, onConvert);
            convertedOptionSet.inputType = this.optionSet.inputType;
            convertedOptionSet.viewType = this.optionSet.viewType;
            convertedOptionSet.emptyText = this.optionSet.emptyText;

            return convertedOptionSet;
        }
        return null;
    }

    convertValue(rawValue: any, onConvert: ConvertFn) {
        return isArray(rawValue)
            ? rawValue.map(valuePart => onConvert(valuePart, this.type, this))
            : onConvert(rawValue, this.type, this);
    }
}

export type ConvertFn = (type: $Values<typeof elementTypes>, value: any, element: DataElement) => any;
