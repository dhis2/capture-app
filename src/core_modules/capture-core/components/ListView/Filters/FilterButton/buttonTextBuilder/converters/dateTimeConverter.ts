import i18n from '@dhis2/d2-i18n';
import { convertIsoToLocalCalendar } from '../../../../../../utils/converters/date';
import type { DateTimeFilterData } from '../../../../../FiltersForTypes/DateTime/types/dateTime.types';

function formatDateTime(isoDatetime: string): string {
    const [datePart, timePart] = isoDatetime.split('T');
    if (!datePart) return isoDatetime;
    return `${convertIsoToLocalCalendar(datePart)} ${timePart?.slice(0, 5) ?? ''}`.trim();
}

export function convertDateTime(filter: DateTimeFilterData): string {
    let appliedText = '';
    const ge = filter.ge ?? '';
    const le = filter.le ?? '';
    const geHasValue = !!ge;
    const leHasValue = !!le;

    if (geHasValue && leHasValue) {
        const fromText = formatDateTime(ge);
        const toText = formatDateTime(le);
        if (fromText === toText) {
            appliedText = fromText;
        } else {
            appliedText = `${fromText} ${i18n.t('to')} ${toText}`;
        }
    } else if (geHasValue) {
        appliedText = `${i18n.t('after or equal to')} ${formatDateTime(ge)}`;
    } else if (leHasValue) {
        appliedText = `${i18n.t('before or equal to')} ${formatDateTime(le)}`;
    }

    return appliedText;
}
