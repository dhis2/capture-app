import {
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';
import type { OrgUnitFilterData } from './types';
import type { Value } from './OrgUnit.types';

export const getOrgUnitFilterData = (value: Value): OrgUnitFilterData | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return value === EMPTY_VALUE_FILTER
            ? { value: EMPTY_VALUE_FILTER_LABEL, isEmpty: true }
            : { value: NOT_EMPTY_VALUE_FILTER_LABEL, isEmpty: false };
    }

    if (!value || typeof value === 'string') return null;
    return { value: value.id, name: value.name };
};
