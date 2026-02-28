import i18n from '@dhis2/d2-i18n';
import type { NumericFilterData } from '../../../../../FiltersForTypes';

export function convertNumeric(filter: NumericFilterData): string {
    console.log('filter', filter);
    if (filter.value) {
        return filter.value;
    }

    const { ge, le } = filter;
    const hasGe = typeof ge === 'number';
    const hasLe = typeof le === 'number';

    if (hasGe && hasLe) {
        return ge === le ? String(ge) : `${ge} ${i18n.t('to')} ${le}`;
    }
    if (hasGe) {
        return `${i18n.t('greater than or equal to')} ${ge}`;
    }
    if (hasLe) {
        return `${i18n.t('less than or equal to')} ${le}`;
    }
    return '';
}
