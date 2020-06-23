// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import RenderFoundation from '../RenderFoundation/RenderFoundation';


export default class SearchGroup {
    _id: string;
    _minAttributesRequiredToSearch: number;
    _searchForm: RenderFoundation;
    _unique: boolean;

    constructor(initFn: ?(_this: SearchGroup) => void) {
        this._minAttributesRequiredToSearch = 0;
        this._unique = false;
        initFn && isFunction(initFn) && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set minAttributesRequiredToSearch(minAttributesRequiredToSearch: number) {
        this._minAttributesRequiredToSearch = minAttributesRequiredToSearch;
    }
    get minAttributesRequiredToSearch(): number {
        return this._minAttributesRequiredToSearch;
    }

    set searchForm(searchForm: RenderFoundation) {
        this._searchForm = searchForm;
    }
    get searchForm(): RenderFoundation {
        return this._searchForm;
    }

    set unique(unique: boolean) {
        this._unique = unique;
    }
    get unique(): boolean {
        return this._unique;
    }
}
