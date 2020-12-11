// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';
import RenderFoundation from '../RenderFoundation/RenderFoundation';

type Searcher = (values: Object, contextProps: Object) => Promise<any>;

export default class InputSearchGroup {
  _id: string;

  _minAttributesRequiredToSearch: number;

  _searchFoundation: RenderFoundation;

  _onSearch: Searcher;

  constructor(initFn: ?(_this: InputSearchGroup) => void) {
    this._minAttributesRequiredToSearch = 0;
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

  set searchFoundation(searchFoundation: RenderFoundation) {
    this._searchFoundation = searchFoundation;
  }

  get searchFoundation(): RenderFoundation {
    return this._searchFoundation;
  }

  set onSearch(searcher: Searcher) {
    this._onSearch = searcher;
  }

  get onSearch(): Searcher {
    return this._onSearch;
  }
}
