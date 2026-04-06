import type { OrgUnitValueFilterData } from '../../../../../FiltersForTypes';

export function convertOrgUnit(filter: OrgUnitValueFilterData): string {
    return filter.name ?? filter.value;
}
