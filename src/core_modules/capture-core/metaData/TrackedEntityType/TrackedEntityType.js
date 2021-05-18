// @flow
import isFunction from 'd2-utilizr/lib/isFunction';
import type { SearchGroup } from '../SearchGroup';
import type { DataElement } from '../DataElement';
import type { TeiRegistration } from './TeiRegistration';
import type { Access } from '../Access';

/* eslint-disable no-underscore-dangle */
export class TrackedEntityType {
    _id: string;
    _access: Access;
    _name: string;
    _teiRegistration: TeiRegistration;
    _attributes: Array<DataElement>;
    _searchGroups: Array<SearchGroup>;

    constructor(initFn: ?(_this: TrackedEntityType) => void) {
        this._attributes = [];
        initFn && isFunction(initFn) && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set access(access: Access) {
        this._access = access;
    }
    get access(): Access {
        return this._access;
    }

    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    set teiRegistration(teiRegistration: TeiRegistration) {
        this._teiRegistration = teiRegistration;
    }
    get teiRegistration(): TeiRegistration {
        return this._teiRegistration;
    }

    set searchGroups(searchGroups: Array<SearchGroup>) {
        this._searchGroups = searchGroups;
    }
    get searchGroups(): Array<SearchGroup> {
        return this._searchGroups;
    }

    set attributes(attributes: Array<DataElement>) {
        this._attributes = attributes;
    }
    get attributes(): Array<DataElement> {
        return this._attributes;
    }
}
