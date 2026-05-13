import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { OptionSetFilter, OptionSetFilterData } from './optionSet.types';

function getSelectOptionSetFilterData(values: Array<any>): OptionSetFilterData {
    return { usingOptionSet: true, values };
}

export function getMultiSelectOptionSetFilterData(values: any): OptionSetFilter | null {
    if (!values) return null;
    if (isEmptyValueFilter(values)) return getEmptyValueFilterData(values);
    return getSelectOptionSetFilterData(values);
}

export function getSingleSelectOptionSetFilterData(value: any): OptionSetFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    return getSelectOptionSetFilterData([value]);
}
