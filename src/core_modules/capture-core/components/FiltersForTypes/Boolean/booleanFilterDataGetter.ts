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

export const getSingleSelectBooleanFilterData = (value: any) => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return { values: [], ...getEmptyValueFilterData(value) };
    }
    return getBooleanFilterData([value]);
};

export const getMultiSelectBooleanFilterData = (values: any) => {
    if (typeof values === 'string' && isEmptyValueFilter(values)) {
        return { values: [], ...getEmptyValueFilterData(values) };
    }
    return getBooleanFilterData(values);
};
