// @flow

import {
    emptyValueFilterSelect,
    isEmptyValueFilter,
} from '../../WorkingLists/WorkingListsCommon/helpers/buildFilterQueryArgs/EmptyValueFilter';
import type { TextFilterData } from './types';

export function getTextFilterData(value: ?string): ?TextFilterData {
    if (isEmptyValueFilter(value)) {
        return emptyValueFilterSelect(value);
    }
    return value ? { value } : null;
}
