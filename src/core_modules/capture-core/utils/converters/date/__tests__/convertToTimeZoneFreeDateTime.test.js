import moment from 'moment';
import { convertToTimeZoneFreeDateTime } from '../convertToTimeZoneFreeDateTime';

const toBrowserTime = value => moment(value).format('YYYY-MM-DDTHH:mm:ss.SSS');

describe('convertToTimeZoneFreeDateTime', () => {
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

    it('converts legacy UTC values to the browser time zone', () => {
        expect(convertToTimeZoneFreeDateTime('2024-01-15T09:30:00.000Z')).toBe(toBrowserTime('2024-01-15T09:30:00.000Z'));
    });

    it('converts values with an offset to the browser time zone', () => {
        expect(convertToTimeZoneFreeDateTime('2024-01-15T12:30:00.000+03:00'))
            .toBe(toBrowserTime('2024-01-15T09:30:00.000Z'));
    });

    it('converts Date objects to the browser time zone', () => {
        const date = new Date('2024-01-15T09:30:00.000Z');
        expect(convertToTimeZoneFreeDateTime(date)).toBe(toBrowserTime(date));
    });
});
