import { formatMomentEn } from 'capture-core-utils/date';
import { parseTime } from 'capture-core-utils/parsers';
import { convertLocalToIsoDate } from './convertLocalToIsoDate';

/**
 * Converts a local calendar date and a time to a timezone-free ISO datetime string (YYYY-MM-DDTHH:mm:ss.SSS)
 * @export
 * @param {string} localDate - date in local calendar format
 * @param {string} time - time string
 * @returns {string | null}
 */
export function convertLocalToIsoDateTime(localDate: string | null | undefined, time: string): string | null {
    const isoDate = convertLocalToIsoDate(localDate);
    const parsedTime = parseTime(time);
    if (!isoDate || !parsedTime.isValid) {
        return null;
    }

    return `${isoDate}T${formatMomentEn(parsedTime.momentTime, 'HH:mm:ss.SSS')}`;
}
