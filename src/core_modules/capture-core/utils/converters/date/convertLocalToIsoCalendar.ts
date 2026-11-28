import moment from 'moment';
import { convertLocalToIsoDate } from './convertLocalToIsoDate';

/**
 * Converts a date from local calendar to ISO calendar
 * @export
 * @param {string} localDate - date in local calendar format
 * @returns {string}
 */
export function convertLocalToIsoCalendar(localDate: string | null | undefined): string {
    const isoDate = convertLocalToIsoDate(localDate);
    if (!isoDate) {
        return '';
    }

    const parsedMoment = moment(isoDate);
    return parsedMoment.isValid() ? parsedMoment.toISOString() : '';
}
