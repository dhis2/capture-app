// @flow

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isNumber if empty.
 * @returns
 */
const isValidOrgUnit = (value: string, isEmptyValid: boolean = false) => {
    if (!value) {
        return isEmptyValid;
    }

    return typeof value === 'string' && value.length > 0;
};

export default isValidOrgUnit;
