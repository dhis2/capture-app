// @flow
import { getEmptyValueResult, getNotEmptyValueResult } from '../../../common/filters/EmptyValueFilter/emptyValueFilterResults';
import type { TextFilterData } from '../index';

export const API_FILTER_NULL: 'null' = 'null';
export const API_FILTER_NOT_NULL: '!null' = '!null';

export const getEmptyOrNotEmptyTextFilterData = (
    filter: any,
): ?TextFilterData => {
    if (filter?.[API_FILTER_NULL]) {
        return getEmptyValueResult();
    }

    if (filter?.[API_FILTER_NOT_NULL]) {
        return getNotEmptyValueResult();
    }

    return undefined;
};
