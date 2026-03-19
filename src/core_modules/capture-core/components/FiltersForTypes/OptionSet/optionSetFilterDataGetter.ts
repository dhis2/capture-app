import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
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

export const getMultiSelectOptionSetFilterData = (values: any) => {
    if (typeof values === 'string' && isEmptyValueFilter(values)) {
        return { usingOptionSet: true, values: [], ...getEmptyValueFilterData(values) };
    }
    return getSelectOptionSetFilterData(values);
};

export const getSingleSelectOptionSetFilterData = (value: any) => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return { usingOptionSet: true, values: [], ...getEmptyValueFilterData(value) };
    }
    return getSelectOptionSetFilterData([value]);
};
