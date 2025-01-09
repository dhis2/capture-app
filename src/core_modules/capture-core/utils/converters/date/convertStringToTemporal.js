// @flow
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import { stringToTemporal } from '../../../../capture-core-utils/date';

/**
 * Converts a date string into a Temporal.PlainDate object using the system set calendar
 * @export
 * @param {*} string - dateString
 * @returns {(Temporal.PlainDate | null)}
 */

type PlainDate = {
    year: number,
    month: number,
    day: number
};

export function convertStringToTemporal(dateString: ?string): PlainDate | null {
    if (!dateString) {
        return null;
    }
    const calendar = systemSettingsStore.get().calendar;
    const dateFormat = systemSettingsStore.get().dateFormat;
    return stringToTemporal(dateString, calendar, dateFormat);
}
