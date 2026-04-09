import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { UsernameFilter, Value } from './username.types';

export const getUsernameFilterData = (value: Value): UsernameFilter | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    if (!value) return null;
    return { value };
};
