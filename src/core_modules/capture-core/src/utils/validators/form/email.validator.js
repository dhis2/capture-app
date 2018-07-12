// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isValidEmail if empty.
 * @returns
 */
const isValidEmail = (value: string, isEmptyValid: boolean = false) => {
    if (!value) {
        return isEmptyValid;
    }

    const isValidEmailFn = Validators.isEmail;
    return isValidEmailFn(value);
};

export default isValidEmail;
