// @flow
import { isValidAge as isValidAgeCore } from 'capture-core-utils/validators/form';

export function isValidAge(value: Object, currentContext?: Object, internalComponentError?: Object) {
    return isValidAgeCore(value, internalComponentError);
}
