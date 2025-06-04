// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { pipe } from 'capture-core-utils';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import { dataElementTypes } from '../../../../metaData';
import { dateUtils } from '../../../../rules/converters';
import { convertIsoToLocalCalendar } from '../../../converters/date';


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
