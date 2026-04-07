import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { OptionSetFilterData } from './optionSet.types';

function getSelectOptionSetFilterData(
    values: Array<any>,
): OptionSetFilterData {
    return {
        usingOptionSet: true,
        values,
    };
}

export const getMultiSelectOptionSetFilterData = (values: any): OptionSetFilterData => {
    if (typeof values === 'string' && isEmptyValueFilter(values)) {
        return getEmptyValueFilterData(values);
    }
    return getSelectOptionSetFilterData(values);
};

export const getSingleSelectOptionSetFilterData = (value: any): OptionSetFilterData => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    return getSelectOptionSetFilterData([value]);
};
