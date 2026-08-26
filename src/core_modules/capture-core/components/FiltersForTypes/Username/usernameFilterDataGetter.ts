import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { UsernameFilter, Value } from './username.types';

export function getUsernameFilterData(value: Value): UsernameFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    return { value };
}
