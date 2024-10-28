// @flow
import { isValidDateTime as isValidDateTimeCore } from 'capture-core-utils/validators/form';

export function isValidDateTime(value: Object, currentContext, internalComponentError) {
    return isValidDateTimeCore(value, internalComponentError);
}
