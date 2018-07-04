// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isNumber if empty.
 * @returns
 */
const isNumber = (value: string, isEmptyValid: boolean = false) => {
    if (!value) {
        return isEmptyValid;
    }

    const isValidNumberFn = Validators.isNumber;
    return isValidNumberFn(value);
};

export default isNumber;
