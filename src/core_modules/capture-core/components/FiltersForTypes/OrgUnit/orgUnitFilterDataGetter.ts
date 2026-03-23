import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { OrgUnitFilterData } from './types';
import type { Value } from './OrgUnit.types';

export const getOrgUnitFilterData = (value: Value): OrgUnitFilterData | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    if (!value || typeof value === 'string') return null;
    return { value: value.id, name: value.name };
};
