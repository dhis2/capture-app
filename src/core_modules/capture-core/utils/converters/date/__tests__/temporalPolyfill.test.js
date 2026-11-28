import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { stringToTemporal, mapDhis2CalendarToTemporal } from 'capture-core-utils/date';
import { getCalculatedValues, calculatedValuesFromNumbersBlur } from 'capture-ui/AgeField/AgeField.component';
import { getAbsoluteRangeErrors } from '../../../../components/FiltersForTypes/Date/AbsoluteRangeFilter.component';
import { isFromAfterTo } from '../../../../components/FiltersForTypes/DateTime/DateTimeFilter.component';
import { getDateRangeValidator } from '../../../validation/validators/form/getDateRangeValidator';
import { getDateTimeRangeValidator } from '../../../validation/validators/form/getDateTimeRangeValidator';

// Pins down every direct use of @js-temporal/polyfill in the app, so that upgrading the
// polyfill can't silently change calculated ages or date range checks. The snapshots were
// captured on 0.4.3 before the 0.5.1 upgrade and must not be regenerated just to make an
// upgrade pass.
const NOW = '2026-10-13T12:00:00Z';

// Local dates (in each calendar), oldest first
const LOCAL_DATES = {
    gregorian: ['1990-03-05', '2024-02-29', '2026-10-13'],
    nepali: ['2046-11-21', '2080-11-17', '2083-06-27'],
};

const AGE_INPUTS = [
    { years: '30', months: '1', days: '2' },
    { years: '0', months: '0', days: '10' },
    { years: '5' },
];

describe.each(Object.keys(LOCAL_DATES))('@js-temporal/polyfill usage (%s)', (calendar) => {
    const [oldest, middle, newest] = LOCAL_DATES[calendar];

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(NOW));
    });
    afterAll(() => jest.useRealTimers());

    beforeEach(() => {
        systemSettingsStore.set({ calendar, dateFormat: 'YYYY-MM-DD' });
    });

    it.each(LOCAL_DATES[calendar])('AgeField calculates the age for %s', (date) => {
        expect(getCalculatedValues(date, calendar, 'YYYY-MM-DD')).toMatchSnapshot();
    });

    it('AgeField calculates the age for a DD-MM-YYYY date', () => {
        const [year, month, day] = middle.split('-');
        expect(getCalculatedValues(`${day}-${month}-${year}`, calendar, 'DD-MM-YYYY')).toMatchSnapshot();
    });

    it.each(AGE_INPUTS)('AgeField calculates the date from years/months/days %o', (values) => {
        expect(calculatedValuesFromNumbersBlur(values, calendar, 'YYYY-MM-DD')).toMatchSnapshot();
    });

    it.each(LOCAL_DATES[calendar])('stringToTemporal parses %s', (date) => {
        const temporal = stringToTemporal(date, mapDhis2CalendarToTemporal[calendar], 'YYYY-MM-DD');
        expect(temporal && {
            year: temporal.year,
            month: temporal.month,
            day: temporal.day,
            eraYear: temporal.eraYear,
            iso: temporal.toPlainDate ? temporal.toPlainDate().toString() : temporal.toString(),
        }).toMatchSnapshot();
    });

    it('getDateRangeValidator compares local dates', () => {
        const validate = getDateRangeValidator('invalid');
        expect([
            validate({ from: oldest, to: newest }),
            validate({ from: newest, to: oldest }),
            validate({ from: middle, to: middle }),
        ]).toMatchSnapshot();
    });

    it('getDateTimeRangeValidator compares local date times', () => {
        const validate = getDateTimeRangeValidator('invalid');
        expect([
            validate({ from: { date: oldest, time: '10:00' }, to: { date: newest, time: '09:00' } }),
            validate({ from: { date: newest, time: '10:00' }, to: { date: oldest, time: '09:00' } }),
            validate({ from: { date: middle, time: '10:00' }, to: { date: middle, time: '09:30' } }),
            validate({ from: { date: middle, time: '0930' }, to: { date: middle, time: '1000' } }),
        ]).toMatchSnapshot();
    });

    it('AbsoluteRangeFilter flags a start date after the end date', () => {
        const value = date => ({ value: date, isValid: true });
        expect([
            getAbsoluteRangeErrors(value(oldest), value(newest), true),
            getAbsoluteRangeErrors(value(newest), value(oldest), true),
            getAbsoluteRangeErrors(value(middle), value(middle), true),
        ]).toMatchSnapshot();
    });

    it('DateTimeFilter flags a start date time after the end date time', () => {
        expect([
            isFromAfterTo({ date: oldest, time: '10:00' }, { date: newest, time: '09:00' }),
            isFromAfterTo({ date: newest }, { date: oldest }),
            isFromAfterTo({ date: middle, time: '10:00' }, { date: middle, time: '09:30' }),
            isFromAfterTo({ date: middle }, { date: middle }),
        ]).toMatchSnapshot();
    });
});
