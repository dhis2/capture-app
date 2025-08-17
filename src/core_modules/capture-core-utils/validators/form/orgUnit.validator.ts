/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
export const isValidOrgUnit = (value: any) => {
    const valid = !!(value && value.id && value.name);
    return valid;
};
