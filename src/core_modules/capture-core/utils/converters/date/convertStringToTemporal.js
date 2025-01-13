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

export function convertStringToTemporal(dateString: ?string, calendar: ?string, format: ?string): PlainDate | null {
    if (!dateString) {
        return null;
    }
    const calendarType = calendar || systemSettingsStore.get().calendar;
    const dateFormat = format || systemSettingsStore.get().dateFormat;
    return stringToTemporal(dateString, calendarType, dateFormat);
}
