// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidOrgUnit = (value: string) => {
    if (!value) {
        return false;
    }

    return typeof value === 'string' && value.length > 0;
};

export default isValidOrgUnit;
