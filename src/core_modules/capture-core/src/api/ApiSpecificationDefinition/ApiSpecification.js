// @flow
/* eslint-disable no-unused-expressions */
import isString from 'd2-utilizr/lib/isString';
import getData from '../fetcher/apiFetchers';
import getterTypes from '../fetcher/getterTypes.const';
import type { Converter } from '../fetcher/apiFetchers';

class ApiSpecification {
    queryParams: ?Object;
    modelName: string;
    modelGetterType: $Values<typeof getterTypes>;
    converter: ?Converter;

    constructor(initFn: (_this: ApiSpecification) => void) {
        initFn && initFn(this);
    }

    updateQueryParams(queryParams: Object) {
        this.queryParams = { ...this.queryParams, ...queryParams };
    }

    setFilter(filter: string) {
        let currentFilterQueryParam = this.queryParams && this.queryParams.filter ? this.queryParams.filter : [];
        if (isString(currentFilterQueryParam)) {
            currentFilterQueryParam = [currentFilterQueryParam];
        }
        this.queryParams = { ...this.queryParams, filter: [...currentFilterQueryParam, filter] };
    }

    get() {
        return getData(this.modelName, this.modelGetterType, this.queryParams, this.converter);
    }
}

export default ApiSpecification;
