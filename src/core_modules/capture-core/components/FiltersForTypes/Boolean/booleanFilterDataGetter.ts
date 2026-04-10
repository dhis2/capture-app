import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { BooleanFilter, Value } from './boolean.types';

export const getBooleanFilterData = (value: Value): BooleanFilter | null => {
    if (typeof value === 'string') {
        return isEmptyValueFilter(value) ? getEmptyValueFilterData(value) : null;
    }
    if (!value && value !== false) {
        return null;
    }
    const values = Array.isArray(value) ? value : [value];
    return { values };
};
