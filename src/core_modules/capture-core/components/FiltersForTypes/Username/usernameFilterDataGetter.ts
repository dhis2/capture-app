import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { UsernameFilterData } from './types';
import type { Value } from './Username.types';

export const getUsernameFilterData = (value: Value): UsernameFilterData | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    if (!value) return null;
    return { value };
};
