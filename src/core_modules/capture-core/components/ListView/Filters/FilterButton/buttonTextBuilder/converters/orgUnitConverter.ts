import type { OrgUnitValueFilterData } from '../../../../../FiltersForTypes/OrgUnit/orgUnit.types';

export function convertOrgUnit(filter: OrgUnitValueFilterData): string {
    return filter.name ?? filter.value;
}
