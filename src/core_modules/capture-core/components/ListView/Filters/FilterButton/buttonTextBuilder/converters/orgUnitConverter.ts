import type { OrgUnitFilterData } from '../../../../../FiltersForTypes/OrgUnit/orgUnit.types';

export function convertOrgUnit(filter: OrgUnitFilterData): string {
    return filter.name ?? filter.value;
}
