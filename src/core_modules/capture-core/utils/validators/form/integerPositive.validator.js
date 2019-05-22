// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidPositiveInteger = (value: string) => {
    const isValidPositiveNumberFn = Validators.isPositiveNumber;
    if (!isValidPositiveNumberFn(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};

export default isValidPositiveInteger;
