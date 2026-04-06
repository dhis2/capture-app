import type { OrgUnitFilterData } from '../../../../../FiltersForTypes';

export function convertOrgUnit(filter: OrgUnitFilterData): string {
    if ('isEmpty' in filter) {
        return String(filter.value);
    }
    return filter.name ?? filter.value;
}
