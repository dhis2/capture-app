import type { OrgUnitFilterData } from '../../../../../ListView';
import { escapeString } from '../../../../../../utils/escapeString';

export function convertOrgUnit({ sourceValue }: { sourceValue: OrgUnitFilterData }): string {
    if ('isEmpty' in sourceValue) {
        return '';
    }
    return `eq:${escapeString(sourceValue.value)}`;
}
