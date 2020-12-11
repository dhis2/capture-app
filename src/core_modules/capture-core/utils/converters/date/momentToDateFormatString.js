// @flow
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a moment instance to a string based on the system date format
 * @export
 * @param {*} moment - the moment instance
 * @returns
 */
export function convertMomentToDateFormatString(moment: any) {
    const {dateFormat} = systemSettingsStore.get();
    const formattedDateString = moment.format(dateFormat);
    return formattedDateString;
}
