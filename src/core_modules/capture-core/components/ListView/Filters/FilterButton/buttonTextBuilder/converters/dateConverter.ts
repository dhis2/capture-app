import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { convertIsoToLocalCalendar } from '../../../../../../utils/converters/date';
import type { DateFilterData, AbsoluteDateFilterData } from '../../../../../FiltersForTypes';
import { areRelativeRangeValuesSupported }
    from '../../../../../../utils/validation/validators/areRelativeRangeValuesSupported';

const periods = {
    TODAY: 'TODAY',
    THIS_WEEK: 'THIS_WEEK',
    THIS_MONTH: 'THIS_MONTH',
    THIS_YEAR: 'THIS_YEAR',
    LAST_WEEK: 'LAST_WEEK',
    LAST_MONTH: 'LAST_MONTH',
    LAST_3_MONTHS: 'LAST_3_MONTHS',
    RELATIVE_RANGE: 'RELATIVE_RANGE',
    ABSOLUTE_RANGE: 'ABSOLUTE_RANGE',
};

const translatedPeriods = {
    [periods.TODAY]: i18n.t('Today'),
    [periods.THIS_WEEK]: i18n.t('This week'),
    [periods.THIS_MONTH]: i18n.t('This month'),
    [periods.THIS_YEAR]: i18n.t('This Year'),
    [periods.LAST_WEEK]: i18n.t('Last week'),
    [periods.LAST_MONTH]: i18n.t('Last month'),
    [periods.LAST_3_MONTHS]: i18n.t('Last 3 months'),
    [periods.RELATIVE_RANGE]: i18n.t('Relative range'),
};

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

// eslint-disable-next-line complexity
function translateRelativeRange(filter: { startBuffer?: number | null; endBuffer?: number | null }): string {
    const hasStart = filter.startBuffer !== undefined && filter.startBuffer !== null;
    const hasEnd = filter.endBuffer !== undefined && filter.endBuffer !== null;
    const startDays = hasStart ? Math.abs(filter.startBuffer as number) : null;
    const endDays = hasEnd ? (filter.endBuffer as number) : null;

    if (startDays !== null && endDays !== null) {
        return i18n.t('{{start}} days in the past to {{end}} days in the future', {
            start: startDays,
            end: endDays,
        });
    }
    if (startDays !== null) {
        return i18n.t('{{count}} days in the past', { count: startDays });
    }
    if (endDays !== null) {
        return i18n.t('{{count}} days in the future', { count: endDays });
    }
    return '';
}

export function convertDate(filter: DateFilterData): string {
    if (filter.type === 'ABSOLUTE') {
        return translateAbsoluteDate(filter);
    }
    if (filter.period) {
        return translatedPeriods[filter.period];
    }
    if (areRelativeRangeValuesSupported(filter.startBuffer, filter.endBuffer)) {
        return translateRelativeRange(filter);
    }
    return '';
}
