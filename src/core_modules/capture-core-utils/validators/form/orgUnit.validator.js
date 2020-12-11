// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */

type OrgUnitValue = {
  id: string,
  name: string,
  path: string,
};

const isValidOrgUnit = (value: OrgUnitValue) => {
  const valid = !!(value && value.id && value.name);
  return valid;
};

export default isValidOrgUnit;
