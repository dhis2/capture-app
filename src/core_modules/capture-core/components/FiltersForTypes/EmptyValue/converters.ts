import {
    API_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from './emptyValue.const';
import type { EmptyValueFilterData } from './emptyValue.types';

export const fromApiEmptyValueFilter = (filter: Record<string, unknown>): EmptyValueFilterData | undefined => {
    if (typeof filter?.[API_EMPTY_VALUE_FILTER] === 'boolean') {
        return {
            isEmpty: filter[API_EMPTY_VALUE_FILTER] as boolean,
            value: filter[API_EMPTY_VALUE_FILTER] ? EMPTY_VALUE_FILTER_LABEL : NOT_EMPTY_VALUE_FILTER_LABEL,
        };
    }
    return undefined;
};

export const toApiEmptyValueFilter = (filter: EmptyValueFilterData): Record<string, boolean> => ({
    [API_EMPTY_VALUE_FILTER]: filter.isEmpty,
});
