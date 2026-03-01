import type { Value } from './EmptyOnly.types';
import {
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';

export type EmptyOnlyFilterData = {
    value: string;
    isEmpty: boolean;
};

export const getEmptyOnlyFilterData = (value?: Value): EmptyOnlyFilterData | null => {
    if (value === EMPTY_VALUE_FILTER) {
        return { value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true };
    }
    if (value === NOT_EMPTY_VALUE_FILTER) {
        return { value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
    }
    return null;
};
