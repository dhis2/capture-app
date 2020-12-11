/* eslint-disable import/prefer-default-export */
// @flow

export const inputTypes = {
  DROPDOWN: 'dropdown',
  VERTICAL_RADIOBUTTONS: 'verticalRadiobuttons',
  HORIZONTAL_RADIOBUTTONS: 'horizontalRadiobuttons',
};

export const inputTypesAsArray: Array<string> = Object.keys(inputTypes).map(
  (key) => inputTypes[key],
);

export const viewTypes = {
  ICON: 'ICON',
  ICON_WITH_COLOR: 'ICON_WITH_COLOR',
};
