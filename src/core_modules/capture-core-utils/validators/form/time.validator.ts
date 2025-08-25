import { parseTime } from '../../parsers';

/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function isValidTime(value: string, _internalComponentError?: {error?: string, errorCode?: string}) {
    const momentTime = parseTime(value);
    return momentTime.isValid;
}
