import { isValidPositiveInteger } from './integerPositive.validator';

/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidZeroOrPositiveInteger = (value: string, _internalComponentError?: {error?: string, errorCode?: string}) => {
    if (value === '0') {
        return true;
    }
    return isValidPositiveInteger(value, _internalComponentError);
};
