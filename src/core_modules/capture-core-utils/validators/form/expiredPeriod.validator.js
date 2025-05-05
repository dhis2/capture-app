// @flow
import { getFixedPeriodByDate } from '@dhis2/multi-calendar-dates';
import { dateUtils } from '../../../capture-core/rules/converters';
import { pipe } from '../../../capture-core-utils';
import { dataElementTypes } from '../../../capture-core/metaData';
import {
    convertClientToServer,
    convertFormToClient,
} from '../../../capture-core/converters';
import { convertIsoToLocalCalendar } from '../../../capture-core/utils/converters/date';

export const isValidPeriod = (
    reportDate: string,
    props: {
        programExpiryPeriodType: string,
        programExpiryDays: number,
    },
) => {
    const { programExpiryPeriodType, programExpiryDays } = props;

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

    if (!thresholdPeriod) {
        return { isValid: false, firstValidDate: null };
    }

    const firstValidDateServer = thresholdPeriod.startDate;

    const isValid = dateUtils.compareDates(reportDateServer, firstValidDateServer) >= 0;
    const firstValidDate = convertIsoToLocalCalendar(firstValidDateServer);

    return { isValid, firstValidDate };
};
