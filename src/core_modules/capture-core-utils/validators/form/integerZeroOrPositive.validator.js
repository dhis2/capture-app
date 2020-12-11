// @flow
import isPositiveInteger from './integerPositive.validator';

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isZeroOrPositiveInteger = (value: string) => {
  if (value === '0') {
    return true;
  }
  return isPositiveInteger(value);
};

export default isZeroOrPositiveInteger;
