import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { convertIsoToLocalCalendar } from '../../../../../../utils/converters/date';
import type { DateTimeFilterData } from '../../../../../FiltersForTypes/DateTime/types/dateTime.types';

function formatDateTime(isoDateTime: string): string {
    const m = moment(isoDateTime);
    if (!m.isValid()) return isoDateTime;
    const datePart = convertIsoToLocalCalendar(m.format('YYYY-MM-DD'));
    const timePart = m.format('HH:mm');
    return `${datePart} ${timePart}`;
}

export function convertDateTime(filter: DateTimeFilterData): string {
    const ge = filter.ge;
    const le = filter.le;

    if (ge && le) {
        const fromText = formatDateTime(ge);
        const toText = formatDateTime(le);
        return fromText === toText
            ? fromText
            : i18n.t('{{from}} to {{to}}', { from: fromText, to: toText });
    }
    if (ge) {
        return i18n.t('after or equal to {{date}}', { date: formatDateTime(ge) });
    }
    if (le) {
        return i18n.t('before or equal to {{date}}', { date: formatDateTime(le) });
    }
    return '';
}
