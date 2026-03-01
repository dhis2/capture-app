import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';
import type { AssigneeFilterData } from './types';

export function getAssigneeFilterData(value: any): AssigneeFilterData {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return value === EMPTY_VALUE_FILTER
            ? { assignedUserMode: '', value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
            : { assignedUserMode: '', value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
    }

    return {
        assignedUserMode: value.mode,
        assignedUser: value.provided,
    };
}
