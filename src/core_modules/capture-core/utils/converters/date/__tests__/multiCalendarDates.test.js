import moment from 'moment';
import { Temporal } from '@js-temporal/polyfill';
import {
    convertFromIso8601,
    convertToIso8601,
    getFixedPeriodByDate,
} from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { temporalToString } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from '../convertIsoToLocalCalendar';
import { convertLocalToIsoCalendar } from '../convertLocalToIsoCalendar';

// Pins down how the app uses @dhis2/multi-calendar-dates directly, so that upgrading the
// library can't silently change converted dates or periods. The snapshots were captured
// before the 3.x upgrade and must not be regenerated just to make an upgrade pass.
const ISO_DATES = ['2024-01-01', '2024-06-15', '2024-12-31'];

// Local dates (in each calendar) corresponding to the ISO dates above
const LOCAL_DATES = {
    gregory: ['2024-01-01', '2024-06-15', '2024-12-31'],
    ethiopian: ['2016-04-22', '2016-10-08', '2017-04-22'],
    nepali: ['2080-09-16', '2081-03-01', '2081-09-16'],
};

// Expiry period types passed to getFixedPeriodByDate by the expiredPeriod validator
const PERIOD_TYPES = ['DAILY', 'WEEKLY', 'MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SIXMONTHLY', 'YEARLY', 'FYAPR'];

describe.each(['gregory', 'ethiopian', 'nepali'])('multi-calendar-dates usage (%s)', (calendar) => {
    beforeEach(() => {
        systemSettingsStore.set({ calendar, dateFormat: 'YYYY-MM-DD' });
    });

    it.each(ISO_DATES)('convertFromIso8601 converts %s', (isoDate) => {
        const { year, month, day, eraYear } = convertFromIso8601(isoDate, calendar);
        expect({ year, month, day, eraYear }).toMatchSnapshot();
    });

    it('convertToIso8601 round trips local dates', () => {
        const isoDates = LOCAL_DATES[calendar].map((localDate) => {
            const { year, month, day } = convertToIso8601(localDate, calendar);
            return { year, month, day };
        });
        expect(isoDates).toMatchSnapshot();
    });

    it('convertIsoToLocalCalendar and convertLocalToIsoCalendar round trip', () => {
        const localDates = ISO_DATES.map(isoDate => convertIsoToLocalCalendar(isoDate));
        expect(localDates).toEqual(LOCAL_DATES[calendar]);
        expect(localDates.map(localDate => moment(convertLocalToIsoCalendar(localDate)).format('YYYY-MM-DD')))
            .toEqual(ISO_DATES);
    });

    it('formats a converted date with temporalToString (AgeField)', () => {
        expect(ISO_DATES.map(isoDate => temporalToString(convertFromIso8601(isoDate, calendar), 'DD-MM-YYYY')))
            .toMatchSnapshot();
    });

    it('accepts a converted ISO date in Temporal date arithmetic (AgeField)', () => {
        const ageIso = convertToIso8601(LOCAL_DATES[calendar][0], calendar);
        const diff = Temporal.PlainDate.from('2025-03-10').since(ageIso, {
            largestUnit: 'years',
            smallestUnit: 'days',
        });
        expect({ years: diff.years, months: diff.months, days: diff.days }).toEqual({ years: 1, months: 2, days: 9 });
    });
});

describe('getFixedPeriodByDate as used by the expiredPeriod validator', () => {
    it.each(PERIOD_TYPES)('finds the %s period containing a date', (periodType) => {
        const { id, startDate, endDate } = getFixedPeriodByDate({
            periodType,
            date: '2024-06-15',
            calendar: 'gregorian',
        });
        expect({ id, startDate, endDate }).toMatchSnapshot();
    });
});
