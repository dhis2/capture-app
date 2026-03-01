import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';
import type { UsernameFilterData } from './types';
import type { Value } from './Username.types';

export const getUsernameFilterData = (value: Value): UsernameFilterData | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return value === EMPTY_VALUE_FILTER
            ? { value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
            : { value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
    }

    if (!value) return null;
    return { value };
};
