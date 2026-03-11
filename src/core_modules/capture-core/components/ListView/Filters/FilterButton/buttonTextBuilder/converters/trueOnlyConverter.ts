import i18n from '@dhis2/d2-i18n';
import type { TrueOnlyFilterData } from '../../../../../FiltersForTypes';

export function convertTrueOnly(filter?: TrueOnlyFilterData): string {
    if (filter?.isEmpty !== undefined && filter?.value) {
        return String(filter.value);
    }
    return i18n.t('Yes');
}
