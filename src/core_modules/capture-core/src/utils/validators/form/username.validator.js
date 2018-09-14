// @flow

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isValidUrl if empty.
 * @returns
 */
export default function isValidUsername(value: string, isEmptyValid: boolean = false) {
    if (!value) {
        return isEmptyValid;
    }

    return value.length > 3;
}
