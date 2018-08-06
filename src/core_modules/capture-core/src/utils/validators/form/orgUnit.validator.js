// @flow

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isValidUrl if empty.
 * @returns
 */
const isValidOrgUnit = (value: string, isEmptyValid: boolean = false) => {
    if (!value) {
        return isEmptyValid;
    }

    return value;
};

export default isValidOrgUnit;
