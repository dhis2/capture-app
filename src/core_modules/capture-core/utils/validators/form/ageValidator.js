// @flow
import { isValidAge as isValidAgeCore } from 'capture-core-utils/validators/form';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

export function isValidAge(value: Object) {
    const format = systemSettingsStore.get().dateFormat;
    return isValidAgeCore(value, format);
}
