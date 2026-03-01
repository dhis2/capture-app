import type { OrgUnitFilterData } from '../../../../../FiltersForTypes';

export function convertOrgUnit(filter: OrgUnitFilterData): string {
    return filter.value;
}
