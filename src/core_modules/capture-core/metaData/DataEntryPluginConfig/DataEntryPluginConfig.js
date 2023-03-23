// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */

import isFunction from 'd2-utilizr/lib/isFunction';
import { DataElement } from '../DataElement';

export class DataEntryPluginConfig {
    _id: string;
    _name: string;
    _fields: Map<string, DataElement>;

    constructor(initFn: ?(_this: DataEntryPluginConfig) => void) {
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

    addField(idFromPlugin: string, field: DataElement) {
        if (!this.fields.has(idFromPlugin)) {
            this.fields.set(idFromPlugin, field);
        }
    }
}
