import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { OrgUnitFilterData, Value } from './orgUnit.types';

export const getOrgUnitFilterData = (value: Value): OrgUnitFilterData | null | undefined => {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    if (!value || typeof value === 'string') return null;
    return { value: value.id, name: value.name };
};
