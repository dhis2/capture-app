import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { BooleanFilterData } from './boolean.types';

export const getBooleanFilterData = (value: any): BooleanFilterData | null => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    const values = Array.isArray(value) ? value : [value];
    return { values };
};
