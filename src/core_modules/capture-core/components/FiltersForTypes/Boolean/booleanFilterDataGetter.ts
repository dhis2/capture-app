import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { BooleanFilter, Value } from './boolean.types';

export const getBooleanFilterData = (value: Value): BooleanFilter | null => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    if (!value && value !== false) {
        return null;
    }
    const values = Array.isArray(value) ? value : [value];
    return { values };
};
