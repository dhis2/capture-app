/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */

import isFunction from 'd2-utilizr/lib/isFunction';
import type { DataElement } from '../DataElement';

type CustomAttribute = {
    IdFromPlugin: string;
    IdFromApp: string;
};

type CustomAttributes = {
    [key: string]: CustomAttribute;
};

export class FormFieldPluginConfig {
    private _id!: string;
    private _name!: string;
    private _pluginSource!: string;
    private _fields!: Map<string, DataElement>;
    private _customAttributes!: CustomAttributes;

    constructor(initFn: ((_this: FormFieldPluginConfig) => void) | undefined) {
        initFn && isFunction(initFn) && initFn(this);
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get fields(): Map<string, DataElement> {
        return this._fields;
    }

    set fields(value: Map<string, DataElement>) {
        this._fields = value;
    }

    get pluginSource(): string {
        return this._pluginSource;
    }

    set pluginSource(value: string) {
        this._pluginSource = value;
    }

    get customAttributes(): CustomAttributes {
        return this._customAttributes;
    }

    set customAttributes(value: CustomAttributes) {
        this._customAttributes = value;
    }

    addField(idFromPlugin: string, field: DataElement): void {
        if (!this.fields.has(idFromPlugin)) {
            this.fields.set(idFromPlugin, field);
        }
    }
}
