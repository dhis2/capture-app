// @flow
import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../../WorkingLists/WorkingListsCommon/helpers/buildFilterQueryArgs/EmptyValueFilter';
import type { TextFilterData } from './types';

export const getTextFilterData = (value: ?string): ?TextFilterData => {
    if (isEmptyValueFilter(value)) {
        return value === EMPTY_VALUE_FILTER
            ? { value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
            : { value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
    }
    return value ? { value } : null;
};
