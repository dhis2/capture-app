// @flow
import { isEqual } from 'lodash';

export function areFiltersEqual(prevFilters: Object, newFilters: Object) {
    if (prevFilters === newFilters) {
        return true;
    }

    const prevFilterKeys = Object.keys(prevFilters).filter(key => prevFilters[key] != null);
    const newFilterKeys = Object.keys(newFilters).filter(key => newFilters[key] != null);
    if (prevFilterKeys.length !== newFilterKeys.length) {
        return false;
    }

    return newFilterKeys
        .every(key => isEqual(newFilters[key], prevFilters[key]));
}
