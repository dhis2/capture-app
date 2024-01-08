// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import log from 'loglevel';
import isFunction from 'd2-utilizr/lib/isFunction';
import isArray from 'd2-utilizr/lib/isArray';
import { errorCreator } from 'capture-core-utils';
import type { Icon } from '../Icon/Icon';
import { OptionSet } from '../OptionSet/OptionSet';
import type { Unique } from './Unique';
import { dataElementTypes } from './dataElementTypes';
import type { CachedAttributeValue } from '../../storageControllers';
import type { Section } from '../RenderFoundation';

// eslint-disable-next-line no-use-before-define
export type ConvertFn = (value: any, type: $Keys<typeof dataElementTypes>, element: DataElement) => any;

export class DataElement {
    static errorMessages = {
        TYPE_NOT_FOUND: 'type not supported',
    };

    _id: string;
    _name: string;
    _shortName: string;
    _code: string;
    _formName: string;
    _disabled: boolean;
    _compulsory: boolean;
    _description: string;
    _type: $Keys<typeof dataElementTypes>;
    _optionSet: ?OptionSet;
    _displayInForms: boolean;
    _displayInReports: boolean;
    _icon: Icon | void;
    _unique: ?Unique;
    _inherit: boolean;
    _searchable: ?boolean;
    _url: ?string;
    _attributeValues: Array<CachedAttributeValue>
    _section: ?Section;

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

    set section(section: ?Section) {
        this._section = section;
    }
    get section(): ?Section {
        return this._section;
    }

    set code(code: string) {
        this._code = code;
    }

    get code(): string {
        return this._code;
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
        if (!dataElementTypes[type]) {
            log.warn(errorCreator(DataElement.errorMessages.TYPE_NOT_FOUND)({ dataElement: this, type }));
            this._type = dataElementTypes.UNKNOWN;
        } else {
            // $FlowFixMe dataElementTypes flow error
            this._type = type;
        }
    }
    get type(): $Keys<typeof dataElementTypes> {
        return this._type;
    }

    set optionSet(optionSet: ?OptionSet) {
        this._optionSet = optionSet;
    }
    get optionSet(): ?OptionSet {
        return this._optionSet;
    }

    set icon(icon: Icon | void) {
        this._icon = icon;
    }
    get icon(): Icon | void {
        return this._icon;
    }

    set unique(unique: Unique) {
        this._unique = unique;
    }
    get unique(): ?Unique {
        return this._unique;
    }

    get inherit(): boolean {
        return this._inherit;
    }

    set inherit(value: boolean) {
        this._inherit = value;
    }

    set searchable(searchable: boolean) {
        this._searchable = searchable;
    }

    get searchable(): ?boolean {
        return this._searchable;
    }

    set url(url: string) {
        this._url = url;
    }

    get url(): ?string {
        return this._url;
    }

    get attributeValues(): Array<CachedAttributeValue> {
        return this._attributeValues;
    }

    set attributeValues(value: Array<CachedAttributeValue>) {
        this._attributeValues = value;
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
            // $FlowFixMe[prop-missing] automated comment
            object[propName] = this[propName];
        }
        return object;
    }

    getConvertedOptionSet(onConvert: ?ConvertFn): ?OptionSet {
        if (this.optionSet) {
            const currentOptions = this.optionSet.options.map(option => option.clone());
            // $FlowFixMe[incompatible-use] automated comment
            const convertedOptionSet = new OptionSet(this.optionSet.id, currentOptions, null, this, onConvert, this.optionSet.attributeValues);
            // $FlowFixMe[incompatible-use] automated comment
            convertedOptionSet.inputType = this.optionSet.inputType;
            // $FlowFixMe[incompatible-use] automated comment
            convertedOptionSet.viewType = this.optionSet.viewType;
            // $FlowFixMe[incompatible-use] automated comment
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

