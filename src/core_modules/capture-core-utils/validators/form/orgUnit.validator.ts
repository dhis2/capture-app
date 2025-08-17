/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isValidOrgUnit = (value: any, _internalComponentError?: {error?: string, errorCode?: string}) => {
    const valid = !!(value && value.id && value.name);
    return valid;
};
