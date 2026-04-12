import type { EmptyOnlyFilterData, Value } from './emptyOnly.types';
import { isEmptyValueFilter, getEmptyValueFilterData } from '../EmptyValue';


export const getEmptyOnlyFilterData = (value?: Value): EmptyOnlyFilterData | null => {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    return null;
};
