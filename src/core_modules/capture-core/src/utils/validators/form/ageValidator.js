// @flow
import isValidAgeCore from './age.validator';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

export function isValidAge(value: Object) {
    const format = systemSettingsStore.get().dateFormat;
    return isValidAgeCore(value, format);
}
