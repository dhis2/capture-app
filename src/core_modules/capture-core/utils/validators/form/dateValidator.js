// @flow
import { isValidDate as isValidDateCore } from 'capture-core-utils/validators/form';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

export function isValidDate(value: string) {
    const format = systemSettingsStore.get().dateFormat;
    return isValidDateCore(value, format);
}
