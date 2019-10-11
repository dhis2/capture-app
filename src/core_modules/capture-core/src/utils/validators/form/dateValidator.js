// @flow
import isValidDateCore from './date.validator';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

export function isValidDate(value: string) {
    const format = systemSettingsStore.get().dateFormat;
    return isValidDateCore(value, format);
}
