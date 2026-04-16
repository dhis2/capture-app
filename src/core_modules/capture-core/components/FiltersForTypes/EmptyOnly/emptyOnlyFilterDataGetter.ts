import type { EmptyOnlyFilter, Value } from './emptyOnly.types';
import { isEmptyValueFilter, getEmptyValueFilterData } from '../EmptyValue';


export const getEmptyOnlyFilterData = (value?: Value): EmptyOnlyFilter | null => {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    return null;
};
