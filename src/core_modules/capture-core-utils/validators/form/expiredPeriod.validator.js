// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { dateUtils } from '../../../capture-core/rules/converters';

export const isValidPeriod = (
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
        return { isValid: false, expiryDate: null };
    }

    const today = dateUtils.getToday();
    const endDate = period.endDate;

    const expiryDate = programExpiryDays
        ? dateUtils.addDays(endDate, programExpiryDays)
        : endDate;

    const isValid = dateUtils.compareDates(today, expiryDate) <= 0;

    return { isValid, expiryDate };
};
