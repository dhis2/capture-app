// @flow
import i18n from '@dhis2/d2-i18n';
import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
} from '../../WorkingLists/WorkingListsCommon/helpers/buildFilterQueryArgs/EmptyValueFilter';
import type { TextFilterData } from './types';

export const getTextFilterData = (value: ?string): ?TextFilterData => {
    if (isEmptyValueFilter(value)) {
        return value === EMPTY_VALUE_FILTER
            ? { value: i18n.t('Is empty'), isEmpty: true }
            : { value: i18n.t('Is not empty'), isNotEmpty: true };
    }
    return value ? { value } : null;
};
