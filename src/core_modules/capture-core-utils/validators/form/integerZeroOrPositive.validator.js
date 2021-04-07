// @flow
import { isPositiveInteger } from './integerPositive.validator';

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
export const isValidZeroOrPositiveInteger = (value: string) => {
    if (value === '0') {
        return true;
    }
    return isPositiveInteger(value);
};
