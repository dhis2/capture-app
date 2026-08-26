import { formatMomentEn } from 'capture-core-utils/date';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Converts a moment instance to a string based on the system date format
 * @export
 * @param {*} moment - the moment instance
 * @returns {string}
 */
export function convertMomentToDateFormatString(moment: any) {
    const dateFormat = systemSettingsStore.get().dateFormat;
    return formatMomentEn(moment, dateFormat);
}
