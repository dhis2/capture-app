// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */

import isFunction from 'd2-utilizr/lib/isFunction';
import type { PluginFormFieldMetadata } from '../../components/D2Form/FormFieldPlugin';

export class FormFieldPluginConfig {
    _id: string;
    _name: string;
    _pluginSource: string;
    _fields: Map<string, PluginFormFieldMetadata>;

    constructor(initFn: ?(_this: FormFieldPluginConfig) => void) {
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

    get fields(): Map<string, PluginFormFieldMetadata> {
        return this._fields;
    }

    set fields(value: Map<string, PluginFormFieldMetadata>) {
        this._fields = value;
    }

    get pluginSource(): string {
        return this._pluginSource;
    }

    set pluginSource(value: string) {
        this._pluginSource = value;
    }

    addField(idFromPlugin: string, field: PluginFormFieldMetadata) {
        if (!this.fields.has(idFromPlugin)) {
            this.fields.set(idFromPlugin, field);
        }
    }
}
