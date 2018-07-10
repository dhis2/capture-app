// @flow
import isPositiveInteger from './integerPositive.validator';

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isZeroOrPositiveInteger if empty.
 * @returns
 */
const isZeroOrPositiveInteger = (value: string, isEmptyValid: boolean = false) => {
    if (value === '0') {
        return true;
    }
    return isPositiveInteger(value, isEmptyValid);
};

export default isZeroOrPositiveInteger;
