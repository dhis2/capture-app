import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { BooleanFilterData } from './types';

export function getBooleanFilterData(
    values: Array<string>,
): BooleanFilterData {
    return {
        values: values.map(value => value),
    };
}

export const getSingleSelectBooleanFilterData = (value: any): BooleanFilterData => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    return getBooleanFilterData([value]);
};

export const getMultiSelectBooleanFilterData = (values: any): BooleanFilterData => {
    if (typeof values === 'string' && isEmptyValueFilter(values)) {
        return getEmptyValueFilterData(values);
    }
    return getBooleanFilterData(values);
};
