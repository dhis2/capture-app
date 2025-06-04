// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { pipe } from 'capture-core-utils';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import { dataElementTypes } from '../../../../metaData';
import { dateUtils } from '../../../../rules/converters';
import { convertIsoToLocalCalendar } from '../../../converters/date';

export const isValidPeriod = (
    reportDate: string,
    expiryPeriod: {
        expiryPeriodType: ?string,
        expiryDays: ?number,
    },
) => {
    const { expiryPeriodType, expiryDays } = expiryPeriod;

    if (!expiryPeriodType) {
        return { isWithinValidPeriod: true, firstValidDate: undefined };
    }

    const convertFn = pipe(convertFormToClient, convertClientToServer);
    const reportDateServer = convertFn(reportDate, dataElementTypes.DATE);
    const today = dateUtils.getToday();

    const threshold = expiryDays
        ? dateUtils.addDays(today, -expiryDays)
        : today;

    const thresholdPeriod = getFixedPeriodByDate({
        periodType: expiryPeriodType,
        date: threshold,
        calendar: 'gregorian',
    });

    const firstValidDateServer = thresholdPeriod.startDate;

    const isWithinValidPeriod = dateUtils.compareDates(reportDateServer, firstValidDateServer) >= 0;
    const firstValidDate = convertIsoToLocalCalendar(firstValidDateServer);

    return { isWithinValidPeriod, firstValidDate };
};
