// @flow
import isValidDateTimeCore from './dateTime.validator';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

export function isValidDateTime(value: Object) {
    const dateFormat = systemSettingsStore.get().dateFormat;
    return isValidDateTimeCore(value, dateFormat);
}
