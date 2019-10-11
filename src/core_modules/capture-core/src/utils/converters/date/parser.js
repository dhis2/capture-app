// @flow
import parseDateCore from '../../parsers/date.parser';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

/**
 * Parse a string in date format
 * @export
 * @param {string} value - the string in date format
 * @returns
 */
export function parseDate(value: string) {
    const format = systemSettingsStore.get().dateFormat;
    return parseDateCore(value, format);
}
