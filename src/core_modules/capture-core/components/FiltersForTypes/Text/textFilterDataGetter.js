// @flow

import { emptyValueFilterResults } from '../../WorkingLists/WorkingListsCommon/helpers/buildFilterQueryArgs/EmptyValueFilter/emptyValueFilterHelpers';
import type { TextFilterData } from './types';

export function getTextFilterData(value: ?string): ?TextFilterData {
    const emptyValueFilter = emptyValueFilterResults(value);
    if (emptyValueFilter) {
        return emptyValueFilter;
    }
    return value ? { value } : null;
}
