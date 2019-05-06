// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidEmail = (value: string) => {
    const isValidEmailFn = Validators.isEmail;
    return isValidEmailFn(value);
};

export default isValidEmail;
