import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { convertIsoToLocalCalendar } from '../../../../../../utils/converters/date';
import {
    mainOptionTranslatedTexts,
    type DateFilterData,
    type AbsoluteDateFilterData,
} from '../../../../../FiltersForTypes';

function translateAbsoluteDate(filter: AbsoluteDateFilterData): string {
    let appliedText = '';
    const fromValue = filter.ge;
    const toValue = filter.le;

    if (fromValue && toValue) {
        const momentFrom = moment(fromValue);
        const momentTo = moment(toValue);
        if (momentFrom.isSame(momentTo)) {
            appliedText = convertIsoToLocalCalendar(fromValue);
        } else {
            const appliedTextFrom = convertIsoToLocalCalendar(fromValue);
            const appliedTextTo = convertIsoToLocalCalendar(toValue);
            appliedText = i18n.t('{{fromDate}} to {{toDate}}', { fromDate: appliedTextFrom, toDate: appliedTextTo });
        }
    } else if (fromValue) {
        const appliedTextFrom = convertIsoToLocalCalendar(fromValue);
        appliedText = i18n.t('after or equal to {{date}}', { date: appliedTextFrom });
    } else {
        const appliedTextTo = convertIsoToLocalCalendar(toValue);
        appliedText = i18n.t('before or equal to {{date}}', { date: appliedTextTo });
    }
    return appliedText;
}

function translateRelativeRange(filter: { startBuffer?: number | null; endBuffer?: number | null }): string {
    const startDays = Math.abs(filter.startBuffer ?? 0);
    const endDays = filter.endBuffer ?? 0;
    return i18n.t('{{start}} days in the past to {{end}} days in the future', {
        start: startDays,
        end: endDays,
    });
}

export function convertDate(filter: DateFilterData): string {
    if ('type' in filter && filter.type === 'ABSOLUTE') {
        return translateAbsoluteDate(filter);
    }
    if ('period' in filter && filter.period) {
        return mainOptionTranslatedTexts[filter.period];
    }
    if ('startBuffer' in filter && (filter.startBuffer != null || filter.endBuffer != null)) {
        return translateRelativeRange(filter);
    }
    return '';
}
