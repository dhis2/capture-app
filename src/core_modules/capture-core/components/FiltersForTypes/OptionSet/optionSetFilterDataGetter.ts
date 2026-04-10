import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { OptionSetFilter, OptionSetFilterData } from './optionSet.types';

function getSelectOptionSetFilterData(values: Array<any>): OptionSetFilterData {
    return { usingOptionSet: true, values };
}

export const getMultiSelectOptionSetFilterData = (values: any): OptionSetFilter | null => {
    if (!values) return null;
    if (typeof values === 'string') {
        return isEmptyValueFilter(values) ? getEmptyValueFilterData(values) : null;
    }
    return getSelectOptionSetFilterData(values);
};

export const getSingleSelectOptionSetFilterData = (value: any): OptionSetFilter | null => {
    if (!value) return null;
    if (typeof value === 'string') {
        return isEmptyValueFilter(value) ? getEmptyValueFilterData(value) : null;
    }
    return getSelectOptionSetFilterData([value]);
};
