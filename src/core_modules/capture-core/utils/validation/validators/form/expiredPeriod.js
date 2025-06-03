// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { pipe } from 'capture-core-utils';
import { convertValue as convertClientToServer } from 'capture-core/converters/clientToServer';
import { convertValue as convertFormToClient } from 'capture-core/converters/formToClient';
import { dataElementTypes } from 'capture-core/metaData';
import { dateUtils } from 'capture-core/rules/converters';
import { convertIsoToLocalCalendar } from 'capture-core/utils/converters/date';

export const isValidPeriod = (
    reportDate: string,
    props: {
        programExpiryPeriodType?: string,
        programExpiryDays?: number,
    },
) => {
    const { programExpiryPeriodType, programExpiryDays } = props;

    if (!programExpiryPeriodType || !programExpiryDays) {
        return { isWithinValidPeriod: true, firstValidDate: undefined };
    }

    const convertFn = pipe(convertFormToClient, convertClientToServer);
    const reportDateServer = convertFn(reportDate, dataElementTypes.DATE);
    const today = dateUtils.getToday();

    const threshold = programExpiryDays
        ? dateUtils.addDays(today, -programExpiryDays)
        : today;

    const thresholdPeriod = getFixedPeriodByDate({
        periodType: programExpiryPeriodType,
        date: threshold,
        calendar: 'gregorian',
    });

    const firstValidDateServer = thresholdPeriod.startDate;

    const isWithinValidPeriod = dateUtils.compareDates(reportDateServer, firstValidDateServer) >= 0;
    const firstValidDate = convertIsoToLocalCalendar(firstValidDateServer);

    return { isWithinValidPeriod, firstValidDate };
};
