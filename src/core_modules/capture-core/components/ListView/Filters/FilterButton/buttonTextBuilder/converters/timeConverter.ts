import i18n from '@dhis2/d2-i18n';
import type { TimeFilterData } from '../../../../../FiltersForTypes';

export function convertTime(filter: TimeFilterData): string {
    let appliedText = '';
    const ge = filter.ge ?? '';
    const le = filter.le ?? '';
    const geHasValue = !!ge;
    const leHasValue = !!le;

    if (geHasValue && leHasValue) {
        if (ge === le) {
            appliedText = ge;
        } else {
            appliedText = `${ge} ${i18n.t('to')} ${le}`;
        }
    } else if (geHasValue) {
        appliedText = `${i18n.t('after or equal to')} ${ge}`;
    } else if (leHasValue) {
        appliedText = `${i18n.t('before or equal to')} ${le}`;
    }

    return appliedText;
}
