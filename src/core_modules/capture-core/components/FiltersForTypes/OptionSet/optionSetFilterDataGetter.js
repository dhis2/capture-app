// @flow
import type { OptionSetFilterData } from '../filters.types';

function getSelectOptionSetFilterData(
    values: Array<any>,
): OptionSetFilterData {
    return {
        usingOptionSet: true,
        values,
    };
}

export const getMultiSelectOptionSetFilterData = getSelectOptionSetFilterData;

export const getSingleSelectOptionSetFilterData = (
    value: any,
) => getSelectOptionSetFilterData([value]);
