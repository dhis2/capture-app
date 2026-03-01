import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';
import type { OptionSetFilterData } from './types';

function getSelectOptionSetFilterData(
    values: Array<any>,
): OptionSetFilterData {
    return {
        usingOptionSet: true,
        values,
    };
}

function getEmptyValueOptionSetFilterData(value: string): OptionSetFilterData {
    return value === EMPTY_VALUE_FILTER
        ? { usingOptionSet: true, values: [], value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
        : { usingOptionSet: true, values: [], value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
}

export const getMultiSelectOptionSetFilterData = (values: any) => {
    if (typeof values === 'string' && isEmptyValueFilter(values)) {
        return getEmptyValueOptionSetFilterData(values);
    }
    return getSelectOptionSetFilterData(values);
};

export const getSingleSelectOptionSetFilterData = (value: any) => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueOptionSetFilterData(value);
    }
    return getSelectOptionSetFilterData([value]);
};
