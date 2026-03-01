import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';
import type { BooleanFilterStringified } from './types';

export function getBooleanFilterData(
    values: Array<string>,
): BooleanFilterStringified {
    return {
        values: values.map(value => value),
    };
}

export function getEmptyValueBooleanFilterData(value: string): BooleanFilterStringified {
    return value === EMPTY_VALUE_FILTER
        ? { values: [], value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
        : { values: [], value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
}

export const getSingleSelectBooleanFilterData = (value: any) => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueBooleanFilterData(value);
    }
    return getBooleanFilterData([value]);
};

export const getMultiSelectBooleanFilterData = (values: any) => {
    if (typeof values === 'string' && isEmptyValueFilter(values)) {
        return getEmptyValueBooleanFilterData(values);
    }
    return getBooleanFilterData(values);
};
