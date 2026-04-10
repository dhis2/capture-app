import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { OrgUnitFilter, Value } from './orgUnit.types';

export function getOrgUnitFilterData(value: Value): OrgUnitFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    if (typeof value === 'string') return null;
    return { value: value.id, name: value.name };
}
