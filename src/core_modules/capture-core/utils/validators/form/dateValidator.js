// @flow
import { isValidDate as isValidDateCore } from 'capture-core-utils/validators/form';

export function isValidDate(value: string, currentContext, internalError) {
    return isValidDateCore(value, internalError);
}
