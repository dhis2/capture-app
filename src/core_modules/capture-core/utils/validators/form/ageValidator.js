// @flow
import { isValidAge as isValidAgeCore } from 'capture-core-utils/validators/form';

export function isValidAge(value: Object, currentContext, internalComponentError) {
    return isValidAgeCore(value, internalComponentError);
}
