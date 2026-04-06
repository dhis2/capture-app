import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { BooleanFilterStringified } from './types';

export function getBooleanFilterData(
    values: Array<string>,
): BooleanFilterStringified {
    return {
        values: values.map(value => value),
    };
}

export const getSingleSelectBooleanFilterData = (value: any): BooleanFilterStringified => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }
    return getBooleanFilterData([value]);
};

export const getMultiSelectBooleanFilterData = (values: any): BooleanFilterStringified => {
    if (typeof values === 'string' && isEmptyValueFilter(values)) {
        return getEmptyValueFilterData(values);
    }
    return getBooleanFilterData(values);
};
