// @flow
import { moment } from 'capture-core-utils/moment';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a date instance to a string based on the system date format
 * @export
 * @param {Date} dateValue: the date instance
 * @returns
 */
export function convertDateObjectToDateFormatString(dateValue: Date) {
    const {dateFormat} = systemSettingsStore.get();
    const formattedDateString = moment(dateValue).format(dateFormat);
    return formattedDateString;
}
