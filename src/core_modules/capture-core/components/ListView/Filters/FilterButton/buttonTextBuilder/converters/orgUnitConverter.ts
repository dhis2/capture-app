import type { OrgUnitFilterData } from '../../../../../FiltersForTypes';

export function convertOrgUnit(filter: OrgUnitFilterData): string {
    if (filter.isEmpty !== undefined) {
        return filter.value;
    }
    return filter.name ?? filter.value;
}
