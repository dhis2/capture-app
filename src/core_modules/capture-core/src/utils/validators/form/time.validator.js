// @flow

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isValidTime if empty.
 * @returns
 */
const isValidTime = (value: string, isEmptyValid: boolean = false) => {
    if (!value) {
        return isEmptyValid;
    }

    return /^(([0-1]*[0-9])|(2[0-3]))([:.])*([0-5][0-9])$/.test(value);
};

export default isValidTime;
