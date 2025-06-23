// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { convertClientToServer } from '../../../../converters';
import { dataElementTypes } from '../../../../metaData';
import { dateUtils } from '../../../../rules/converters';
import { convertIsoToLocalCalendar } from '../../../converters/date';

export const isValidPeriod = (
    reportDate: string,
    expiryPeriod?: ?{
        expiryPeriodType: ?string,
        expiryDays: ?number,
    },
) => {
    if (!expiryPeriod) {
        return { isWithinValidPeriod: true, firstValidDate: undefined };
    }

    const { expiryPeriodType, expiryDays } = expiryPeriod;

    if (!expiryPeriodType) {
        return { isWithinValidPeriod: true, firstValidDate: undefined };
    }

    const reportDateServer = ((convertClientToServer(reportDate, dataElementTypes.DATE): any): string);
    const today = dateUtils.getToday();

    const threshold = expiryDays
        ? dateUtils.addDays(today, -expiryDays)
        : today;

    const thresholdPeriod = getFixedPeriodByDate({
        periodType: expiryPeriodType,
        date: threshold,
        calendar: 'gregorian',
    });

    const firstValidDateServer: ?string = thresholdPeriod.startDate;

    const isWithinValidPeriod = dateUtils.compareDates(reportDateServer, firstValidDateServer) >= 0;
    const firstValidDate = convertIsoToLocalCalendar(firstValidDateServer);

    return { isWithinValidPeriod, firstValidDate };
};
