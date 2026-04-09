import type { OrgUnitFilterData } from '../../../../../FiltersForTypes';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertOrgUnit({ sourceValue }: { sourceValue: OrgUnitFilterData }): string {
    return `eq:${escapeString(sourceValue.value)}`;
}
