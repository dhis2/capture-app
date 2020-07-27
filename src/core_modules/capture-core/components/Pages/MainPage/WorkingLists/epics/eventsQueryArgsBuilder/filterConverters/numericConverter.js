// @flow
import type { NumericFilterData } from '../../../../../../FiltersForTypes/filters.types';

export function convertNumeric(filter: NumericFilterData) {
    const requestData = [];

    if (filter.ge || filter.ge === 0) {
        requestData.push(`ge:${filter.ge}`);
    }
    if (filter.le || filter.le === 0) {
        requestData.push(`le:${filter.le}`);
    }

    return requestData.join(':');
}
