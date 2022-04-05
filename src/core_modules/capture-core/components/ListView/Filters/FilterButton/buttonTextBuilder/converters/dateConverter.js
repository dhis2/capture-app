// @flow
import i18n from '@dhis2/d2-i18n';
import { pipe } from 'capture-core-utils';
import moment from 'moment';
import { convertMomentToDateFormatString } from '../../../../../../utils/converters/date';
import type { DateFilterData, AbsoluteDateFilterData } from '../../../../../FiltersForTypes';
import { areRelativeRangeValuesSupported } from '../../../../../../utils/validators/areRelativeRangeValuesSupported';

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

const convertToViewValue = (filterValue: string) => pipe(
    value => moment(value),
    momentDate => convertMomentToDateFormatString(momentDate),
)(filterValue);

function translateAbsoluteDate(filter: AbsoluteDateFilterData) {
    let appliedText = '';
    const fromValue = filter.ge;
    const toValue = filter.le;

    if (fromValue && toValue) {
        const momentFrom = moment(fromValue);
        const momentTo = moment(toValue);
        if (momentFrom.isSame(momentTo)) {
            appliedText = convertMomentToDateFormatString(momentFrom);
        } else {
            const appliedTextFrom = convertMomentToDateFormatString(momentFrom);
            const appliedTextTo = convertMomentToDateFormatString(momentTo);
            appliedText = i18n.t('{{fromDate}} to {{toDate}}', { fromDate: appliedTextFrom, toDate: appliedTextTo });
        }
    } else if (fromValue) {
        const appliedTextFrom = convertToViewValue(fromValue);
        appliedText = i18n.t('after or equal to {{date}}', { date: appliedTextFrom });
    } else {
        // $FlowFixMe[incompatible-call] automated comment
        const appliedTextTo = convertToViewValue(toValue);
        appliedText = i18n.t('before or equal to {{date}}', { date: appliedTextTo });
    }
    return appliedText;
}

export function convertDate(filter: DateFilterData): string {
    if (filter.type === 'ABSOLUTE') {
        return translateAbsoluteDate(filter);
    }
    if (filter.period) {
        return translatedPeriods[filter.period];
    }
    if (areRelativeRangeValuesSupported(filter.startBuffer, filter.endBuffer)) {
        return translatedPeriods[periods.RELATIVE_RANGE];
    }
    return '';
}
