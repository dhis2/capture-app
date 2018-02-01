// @flow
/* eslint-disable no-unused-expressions */
import getData from '../fetcher/apiFetchers';
import getterTypes from '../fetcher/getterTypes.const';
import type { Converter } from '../fetcher/apiFetchers';

class ApiSpecification {
    queryParams: ?Object;
    modelName: string;
    modelGetterType: $Values<typeof getterTypes>;
    converter: Converter;

    constructor(initFn: (_this: ApiSpecification) => void) {
        initFn && initFn(this);
    }

    updateQueryParams(queryParams: Object) {
        this.queryParams = { ...this.queryParams, ...queryParams };
    }

    setFilter(filter: string) {
        this.queryParams = { ...this.queryParams, filter };
    }

    get() {
        return getData(this.modelName, this.modelGetterType, this.queryParams, this.converter);
    }
}

export default ApiSpecification;
