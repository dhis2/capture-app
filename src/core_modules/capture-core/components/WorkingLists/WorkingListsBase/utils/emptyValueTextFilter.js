// @flow
import {
    API_FILTER_NULL,
    API_FILTER_NOT_NULL,
} from '../../WorkingListsCommon/helpers/buildFilterQueryArgs/EmptyValueFilter/constants';
import {
    getEmptyValueResult,
    getNotEmptyValueResult,
} from '../../WorkingListsCommon/helpers/buildFilterQueryArgs/EmptyValueFilter/emptyValueFilterHelpers';
import type { TextFilterData } from '../index';

export { API_FILTER_NULL, API_FILTER_NOT_NULL } from '../../WorkingListsCommon/helpers/buildFilterQueryArgs/EmptyValueFilter/constants';

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
