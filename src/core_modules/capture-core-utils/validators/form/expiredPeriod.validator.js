// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { dateUtils } from '../../../capture-core/rules/converters';

export const isExpiredPeriod = (
    reportDate: string,
    props: Object,
) => {
    const { programExpiryPeriodType, programExpiryDays } = props;
    const period = getFixedPeriodByDate({
        periodType: programExpiryPeriodType,
        date: reportDate,
        calendar: 'gregory',
        locale: 'en',
    });
    if (!period) {
        return false;
    }

    const today = dateUtils.getToday();
    const endDate = period.endDate;

    if (programExpiryDays) {
        const expiryDate = dateUtils.addDays(endDate, programExpiryDays);
        return dateUtils.compareDates(today, expiryDate) > 0;
    }
    return dateUtils.compareDates(today, endDate) > 0;
};
