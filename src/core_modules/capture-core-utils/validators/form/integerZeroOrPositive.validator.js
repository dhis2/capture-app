// @flow
import { isValidPositiveInteger } from './integerPositive.validator';

/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidZeroOrPositiveInteger = (value: string) => {
    if (value === '0') {
        return true;
    }
    return isValidPositiveInteger(value);
};
