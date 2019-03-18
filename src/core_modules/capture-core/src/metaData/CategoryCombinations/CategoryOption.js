// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/src/isFunction';
import type { Access } from '../Access/Access';

export default class CategoryOption {
    _name: string;
    _id: string;
    _access: Access;
    _organisationUnitIds: ?Array<string>;

    constructor(initFn: ?(_this: CategoryOption) => void) {
        this.name = '';
        this.id = '';
        this._access = {};
        initFn && isFunction(initFn) && initFn(this);
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get access(): Access {
        return this._access;
    }

    set access(access: Access) {
        this._access = access;
    }

    get organisationUnitIds(): ?Array<string> {
        return this._organisationUnitIds;
    }

    set organisationUnitIds(ids: ?Array<string>) {
        this._organisationUnitIds = ids;
    }
}
