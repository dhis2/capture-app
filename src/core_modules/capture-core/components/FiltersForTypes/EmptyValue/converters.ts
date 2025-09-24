import {
    API_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from './constants';
import type { EmptyValueFilterData } from './types';

export const fromApiEmptyValueFilter = (filter: Record<string, unknown>): EmptyValueFilterData | undefined => {
    if (typeof filter?.[API_EMPTY_VALUE_FILTER] === 'boolean') {
        return {
            isEmpty: filter[API_EMPTY_VALUE_FILTER] as boolean,
            value: filter[API_EMPTY_VALUE_FILTER] ? EMPTY_VALUE_FILTER_LABEL : NOT_EMPTY_VALUE_FILTER_LABEL,
        };
    }
    return undefined;
};

export const toApiEmptyValueFilter = (filter: EmptyValueFilterData): Record<string, boolean> | undefined => {
    if (filter.isEmpty === true) {
        return { [API_EMPTY_VALUE_FILTER]: true };
    }
    if (filter.isEmpty === false) {
        return { [API_EMPTY_VALUE_FILTER]: false };
    }
    return undefined;
};
