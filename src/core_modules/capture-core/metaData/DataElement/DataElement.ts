/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import isFunction from 'd2-utilizr/lib/isFunction';
import { errorCreator } from 'capture-core-utils';
import type { Icon } from '../Icon/Icon';
import { OptionSet } from '../OptionSet';
import { dataElementTypes } from './dataElementTypes';
import type { CachedAttributeValue } from '../../storageControllers';
import type { Section } from '../RenderFoundation';
import type { Unique } from './Unique';

export type ConvertFn = (value: any, type: keyof typeof dataElementTypes, element: DataElement) => any;

export class DataElement {
    static errorMessages = {
        TYPE_NOT_FOUND: 'type not supported',
    };

    _id!: string;
    _name!: string;
    _shortName!: string;
    _code!: string;
    _formName!: string;
    _disabled = false;
    _compulsory = false;
    _description!: string;
    _type!: keyof typeof dataElementTypes;
    _optionSet?: OptionSet;
    _displayInForms = true;
    _displayInReports = true;
    _icon?: Icon;
    _unique?: Unique;
    _inherit?: boolean;
    _searchable?: boolean;
    _url?: string;
    _attributeValues?: CachedAttributeValue[];
    _section?: Section;

    // eslint-disable-next-line complexity
    constructor(initFn?: (_this: DataElement) => void) {
        this.type = dataElementTypes.UNKNOWN;
        this._displayInReports = true;
        this._displayInForms = true;
        this.disabled = false;
        this.compulsory = false;

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

    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    set section(section: Section | undefined) {
        this._section = section;
    }
    get section(): Section | undefined {
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

    get displayInForms(): boolean {
        return this._displayInForms;
    }

    set displayInForms(display: boolean | null | undefined) {
        this._displayInForms = display != null ? display : true;
    }

    set displayInReports(display: boolean | null | undefined) {
        this._displayInReports = display != null ? display : true;
    }
    get displayInReports(): boolean {
        return this._displayInReports;
    }

    set disabled(disabled: boolean | null | undefined) {
        this._disabled = !!disabled;
    }
    get disabled(): boolean {
        return this._disabled;
    }

    set compulsory(compulsory: boolean | null | undefined) {
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
        const typeKey = type as keyof typeof dataElementTypes;
        if (!dataElementTypes[typeKey]) {
            log.warn(errorCreator(DataElement.errorMessages.TYPE_NOT_FOUND)({ dataElement: this, type }));
            this._type = dataElementTypes.UNKNOWN;
        } else {
            this._type = typeKey;
        }
    }

    get type(): keyof typeof dataElementTypes {
        return this._type;
    }

    set optionSet(optionSet: OptionSet | undefined) {
        this._optionSet = optionSet;
    }
    get optionSet(): OptionSet | undefined {
        return this._optionSet;
    }

    set icon(icon: Icon | undefined) {
        this._icon = icon;
    }
    get icon(): Icon | undefined {
        return this._icon;
    }

    set unique(unique: Unique | undefined) {
        this._unique = unique;
    }
    get unique(): Unique | undefined {
        return this._unique;
    }

    get inherit(): boolean | undefined {
        return this._inherit;
    }

    set inherit(value: boolean) {
        this._inherit = value;
    }

    set searchable(searchable: boolean | undefined) {
        this._searchable = searchable;
    }

    get searchable(): boolean | undefined {
        return this._searchable;
    }

    set url(url: string | undefined) {
        this._url = url;
    }

    get url(): string | undefined {
        return this._url;
    }

    get attributeValues(): CachedAttributeValue[] | undefined {
        return this._attributeValues;
    }

    set attributeValues(value: CachedAttributeValue[]) {
        this._attributeValues = value;
    }

    * getPropertyNames(): Generator<string, void, void> {
        const excluded = ['getPropertyNames', 'constructor', 'copyPropertiesTo', 'getConvertedOptionSet', 'convertValue'];
        // Get properties from the prototype
        for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            // Check if the property is actually a function (method) if that's the intent
            if (!excluded.includes(name) && typeof this[name] === 'function') {
                yield name;
            }
        }
    }

    copyPropertiesTo(object: Record<string, any>): Record<string, any> {
        for (const propName of this.getPropertyNames()) {
            object[propName] = this[propName];
        }
        return object;
    }


    getConvertedOptionSet(onConvert?: ConvertFn): OptionSet | undefined {
        if (this.optionSet) {
            const currentOptions = this.optionSet.options.map(option => option.clone());

            const convertedOptionSet = new OptionSet(
                this.optionSet.id,
                currentOptions,
                undefined,
                this,
                onConvert,
                this.optionSet.attributeValues,
            );

            convertedOptionSet.inputType = this.optionSet.inputType;
            if (this.optionSet.viewType) {
                convertedOptionSet.viewType = this.optionSet.viewType;
            }
            if (this.optionSet.emptyText) {
                convertedOptionSet.emptyText = this.optionSet.emptyText;
            }

            return convertedOptionSet;
        }

        return undefined;
    }

    convertValue(rawValue: any, onConvert: ConvertFn): any {
        return Array.isArray(rawValue)
            ? rawValue.map((valuePart: any) => onConvert(valuePart, this.type, this))
            : onConvert(rawValue, this.type, this);
    }
}
