import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { OrgUnitFilter, Value } from './orgUnit.types';

export function getOrgUnitFilterData(value: Value): OrgUnitFilter | null {
    if (!value) return null;
    if (typeof value === 'string') {
        return isEmptyValueFilter(value) ? getEmptyValueFilterData(value) : null;
    }
    return { value: value.id, name: value.name };
}
