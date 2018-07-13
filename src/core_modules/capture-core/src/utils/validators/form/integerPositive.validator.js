// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isValidPositiveInteger if empty.
 * @returns
 */
const isValidPositiveInteger = (value: string, isEmptyValid: boolean = false) => {
    if (!value) {
        return isEmptyValid;
    }

    const isValidPositiveNumberFn = Validators.isPositiveNumber;
    if (!isValidPositiveNumberFn(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};

export default isValidPositiveInteger;
