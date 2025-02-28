// @flow
import moment from 'moment';
import {
    convertToIso8601,
} from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from '../../../../capture-core/metaDataMemoryStores';
import { padWithZeros } from '../../../../capture-core-utils/date';

/**
 * Converts a date from local calendar to ISO calendar
 * @export
 * @param {string} localDate - date in local calendar format
 * @returns {string}
 */
export function convertLocalToIsoCalendar(localDate: ?string): string {
    if (!localDate) {
        return '';
    }

    const calendar = systemSettingsStore.get().calendar;

    const { year, month, day } = convertToIso8601(localDate, calendar);
    const dateString = `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(day, 2)}`;
    const parsedMoment = moment(dateString);

    return parsedMoment.isValid() ? parsedMoment.toISOString() : '';
}
