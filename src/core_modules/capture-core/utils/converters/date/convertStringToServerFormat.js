// @flow
import moment from 'moment';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a string date to a string date with the format the server expects
 * @export
 * @param {*} string - the string instance
 * @returns {string}
 */
export function convertStringToServerFormat(date: string) {
    if (!date || !date.length) { return ''; }
    const dateFormat = systemSettingsStore.get().dateFormat;
    const formattedDateString = moment(date, dateFormat).format('YYYY-MM-DD');
    return formattedDateString;
}
