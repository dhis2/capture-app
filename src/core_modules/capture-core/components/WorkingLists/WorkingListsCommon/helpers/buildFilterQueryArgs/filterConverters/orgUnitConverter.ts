import type { OrgUnitFilterData } from '../../../../../ListView';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertOrgUnit({ sourceValue }: { sourceValue: OrgUnitFilterData }): string {
    return `eq:${escapeString(sourceValue.id ?? sourceValue.value)}`;
}
