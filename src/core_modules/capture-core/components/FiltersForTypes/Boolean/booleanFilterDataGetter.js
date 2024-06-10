// @flow
import type { BooleanFilterStringified } from './types';

export function getBooleanFilterData(
    values: Array<string>,
): BooleanFilterStringified {
    return {
        values: values.map(value => value),
    };
}

export const getSingleSelectBooleanFilterData = (value: any) => getBooleanFilterData([value]);

export const getMultiSelectBooleanFilterData = (values: any) => getBooleanFilterData(values);
