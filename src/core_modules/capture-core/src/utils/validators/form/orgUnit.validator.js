// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */

type OrgUnitValue = {
    id: string,
    displayName: string,
    path: string,
}

const isValidOrgUnit = (value: OrgUnitValue) => {
    const valid = !!(value && value.id && value.displayName && value.path);
    return valid;
} 

export default isValidOrgUnit;
