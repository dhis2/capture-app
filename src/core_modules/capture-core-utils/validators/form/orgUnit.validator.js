// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns {boolean}
 */

type OrgUnitValue = {
    id: string,
    displayName: string,
    path: string,
}

export const isValidOrgUnit = (value: OrgUnitValue) => {
    const valid = !!(value && value.id && value.displayName);
    return valid;
};
