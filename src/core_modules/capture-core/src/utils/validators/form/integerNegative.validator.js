// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidNegativeInteger = (value: string) => {
    const isValidNumberFn = Validators.isNumber;
    if (!isValidNumberFn(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number) && number < 0;
};

export default isValidNegativeInteger;
