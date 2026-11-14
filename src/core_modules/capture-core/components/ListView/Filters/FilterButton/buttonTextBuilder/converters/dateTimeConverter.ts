import i18n from '@dhis2/d2-i18n';
import { convertDateTimeForDisplay } from '../../../../../../utils/converters/date';
import type { DateTimeFilterData } from '../../../../../FiltersForTypes/DateTime/dateTime.types';

export function convertDateTime(filter: DateTimeFilterData): string {
    let appliedText = '';
    const ge = filter.ge ?? '';
    const le = filter.le ?? '';
    const geHasValue = !!ge;
    const leHasValue = !!le;

    if (geHasValue && leHasValue) {
        const fromText = convertDateTimeForDisplay(ge);
        const toText = convertDateTimeForDisplay(le);
        if (fromText === toText) {
            appliedText = fromText;
        } else {
            appliedText = i18n.t('{{fromDate}} to {{toDate}}', { fromDate: fromText, toDate: toText });
        }
    } else if (geHasValue) {
        appliedText = i18n.t('after or equal to {{date}}', { date: convertDateTimeForDisplay(ge) });
    } else if (leHasValue) {
        appliedText = i18n.t('before or equal to {{date}}', { date: convertDateTimeForDisplay(le) });
    }

    return appliedText;
}
