import { systemSettingsStore } from '../../metaDataMemoryStores';
import { getOrgUnitOpeningCalendarMin, getOrgUnitClosingCalendarMax } from './getOrgUnitCalendarBounds';

describe('getOrgUnitCalendarBounds', () => {
    beforeAll(() => {
        systemSettingsStore.set({ calendar: 'gregory', dateFormat: 'YYYY-MM-DD' });
    });

    describe('getOrgUnitOpeningCalendarMin', () => {
        it('returns undefined when there is no opening date', () => {
            expect(getOrgUnitOpeningCalendarMin(undefined)).toBeUndefined();
            expect(getOrgUnitOpeningCalendarMin({})).toBeUndefined();
        });

        it('returns the opening date as a local-calendar string, ignoring any time component', () => {
            expect(getOrgUnitOpeningCalendarMin({ openingDate: '2023-01-01T00:00:00.000' })).toBe('2023-01-01');
            expect(getOrgUnitOpeningCalendarMin({ openingDate: '2023-01-01' })).toBe('2023-01-01');
        });
    });

    describe('getOrgUnitClosingCalendarMax', () => {
        it('returns undefined when neither a closing date nor a future limit applies', () => {
            expect(getOrgUnitClosingCalendarMax(undefined, false)).toBeUndefined();
            expect(getOrgUnitClosingCalendarMax({}, false)).toBeUndefined();
        });

        it('returns the closing date when only a closing date applies', () => {
            expect(getOrgUnitClosingCalendarMax({ closedDate: '2023-06-30T00:00:00.000' }, false)).toBe('2023-06-30');
        });

        it('returns a date when only the no-future limit applies', () => {
            const result = getOrgUnitClosingCalendarMax(undefined, true);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('uses the closing date when it is earlier than the no-future limit', () => {
            expect(getOrgUnitClosingCalendarMax({ closedDate: '2000-01-01' }, true)).toBe('2000-01-01');
        });

        it('uses the no-future limit when the closing date is later than today', () => {
            const earliestOfFutureClosingAndToday = getOrgUnitClosingCalendarMax({ closedDate: '2999-12-31' }, true);
            const todayOnly = getOrgUnitClosingCalendarMax(undefined, true);
            expect(earliestOfFutureClosingAndToday).toBe(todayOnly);
        });
    });
});
