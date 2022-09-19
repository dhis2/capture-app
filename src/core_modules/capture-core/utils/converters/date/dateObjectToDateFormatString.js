// @flow
import moment from 'moment';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a date instance to a string based on the system date format
 * @export
 * @param {Date} dateValue: the date instance
 * @returns {string}
 */
export function convertDateObjectToDateFormatString(dateValue: Date) {
    const dateFormat = systemSettingsStore.get().dateFormat;
    const formattedDateString = moment(dateValue).format(dateFormat);
    return formattedDateString;
}
