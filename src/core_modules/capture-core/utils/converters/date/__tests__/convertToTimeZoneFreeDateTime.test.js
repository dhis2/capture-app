import { systemSettingsStore } from '../../../../metaDataMemoryStores';
import { convertToTimeZoneFreeDateTime } from '../convertToTimeZoneFreeDateTime';

describe('convertToTimeZoneFreeDateTime', () => {
    beforeEach(() => {
        systemSettingsStore.set({ serverTimeZoneId: 'Africa/Kampala' });
    });

    it('returns null for empty values', () => {
        expect(convertToTimeZoneFreeDateTime(null)).toBeNull();
        expect(convertToTimeZoneFreeDateTime('')).toBeNull();
    });

    it('returns null for invalid values', () => {
        expect(convertToTimeZoneFreeDateTime('2024-13-45T10:30')).toBeNull();
    });

    it('keeps values without a timezone as entered', () => {
        expect(convertToTimeZoneFreeDateTime('2024-01-15T10:30')).toBe('2024-01-15T10:30:00.000');
        expect(convertToTimeZoneFreeDateTime('2024-01-15T10:30:45.123')).toBe('2024-01-15T10:30:45.123');
    });

    it('does not adjust values without a timezone for daylight saving', () => {
        expect(convertToTimeZoneFreeDateTime('2024-03-31T02:30:00.000')).toBe('2024-03-31T02:30:00.000');
    });

    it('converts legacy UTC values to the server time zone', () => {
        expect(convertToTimeZoneFreeDateTime('2026-11-10T13:00:00.000Z')).toBe('2026-11-10T16:00:00.000');
    });

    it('converts values with an offset to the server time zone', () => {
        expect(convertToTimeZoneFreeDateTime('2024-01-15T12:30:00.000+01:00')).toBe('2024-01-15T14:30:00.000');
    });

    it('applies the server time zone daylight saving rules', () => {
        systemSettingsStore.set({ serverTimeZoneId: 'Europe/Oslo' });
        expect(convertToTimeZoneFreeDateTime('2024-01-15T09:30:00.000Z')).toBe('2024-01-15T10:30:00.000');
        expect(convertToTimeZoneFreeDateTime('2024-07-15T09:30:00.000Z')).toBe('2024-07-15T11:30:00.000');
    });

    it('converts Date objects to the server time zone', () => {
        expect(convertToTimeZoneFreeDateTime(new Date('2024-01-15T09:30:00.000Z'))).toBe('2024-01-15T12:30:00.000');
    });
});
