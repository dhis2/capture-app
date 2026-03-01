import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';
import type { TrueOnlyFilterData } from './types';

export function getTrueOnlyFilterData(value?: string): TrueOnlyFilterData {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return value === EMPTY_VALUE_FILTER
            ? { value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
            : { value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
    }

    return {
        value: true,
    };
}
