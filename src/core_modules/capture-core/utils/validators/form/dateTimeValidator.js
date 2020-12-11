// @flow
import { isValidDateTime as isValidDateTimeCore } from 'capture-core-utils/validators/form';
import { systemSettingsStore } from '../../../metaDataMemoryStores';

export function isValidDateTime(value: Object) {
    const {dateFormat} = systemSettingsStore.get();
    return isValidDateTimeCore(value, dateFormat);
}
