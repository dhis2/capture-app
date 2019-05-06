// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isNumber = (value: string) => {
    const isValidNumberFn = Validators.isNumber;
    return isValidNumberFn(value);
};

export default isNumber;
