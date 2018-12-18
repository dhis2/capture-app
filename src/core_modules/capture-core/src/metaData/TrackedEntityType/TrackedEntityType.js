// @flow
import isFunction from 'd2-utilizr/src/isFunction';
import { RenderFoundation } from '../RenderFoundation';
import { SearchGroup } from '../SearchGroup';

/* eslint-disable no-underscore-dangle */
class TrackedEntityType {
    _id: string;
    _name: string;
    _foundation: RenderFoundation;
    _searchGroups: Array<SearchGroup>;

    constructor(initFn: ?(_this: TrackedEntityType) => void) {
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

    set foundation(foundation: RenderFoundation) {
        this._foundation = foundation;
    }
    get foundation(): RenderFoundation {
        return this._foundation;
    }

    set searchGroups(searchGroups: Array<SearchGroup>) {
        this._searchGroups = searchGroups;
    }
    get searchGroups(): Array<SearchGroup> {
        return this._searchGroups;
    }
}

export default TrackedEntityType;
