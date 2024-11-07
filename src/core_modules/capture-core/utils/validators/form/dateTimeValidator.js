// @flow
import { isValidDateTime as isValidDateTimeCore } from 'capture-core-utils/validators/form';

export function isValidDateTime(value: Object, internalComponentError?: Object) {
    return isValidDateTimeCore(value, internalComponentError);
}
