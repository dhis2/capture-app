import type { OrgUnitValueFilterData } from '../../../../../FiltersForTypes/OrgUnit/orgUnit.types';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertOrgUnit({ sourceValue }: { sourceValue: OrgUnitValueFilterData }): string {
    return `eq:${escapeString(sourceValue.value)}`;
}
