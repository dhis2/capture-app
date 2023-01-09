"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultValues = void 0;

var _constants = require("../../constants");

const defaultValues = {
  [_constants.typeKeys.TEXT]: '',
  [_constants.typeKeys.LONG_TEXT]: '',
  [_constants.typeKeys.PHONE_NUMBER]: '',
  [_constants.typeKeys.EMAIL]: '',
  [_constants.typeKeys.BOOLEAN]: false,
  [_constants.typeKeys.TRUE_ONLY]: false,
  [_constants.typeKeys.DATE]: '',
  [_constants.typeKeys.DATETIME]: '',
  [_constants.typeKeys.TIME]: '',
  [_constants.typeKeys.NUMBER]: 0,
  [_constants.typeKeys.PERCENTAGE]: 0,
  [_constants.typeKeys.INTEGER]: 0,
  [_constants.typeKeys.INTEGER_POSITIVE]: 0,
  [_constants.typeKeys.INTEGER_NEGATIVE]: 0,
  [_constants.typeKeys.INTEGER_ZERO_OR_POSITIVE]: 0,
  [_constants.typeKeys.USERNAME]: '',
  [_constants.typeKeys.COORDINATE]: '',
  [_constants.typeKeys.ORGANISATION_UNIT]: '',
  [_constants.typeKeys.AGE]: '',
  [_constants.typeKeys.URL]: '',
  [_constants.typeKeys.FILE_RESOURCE]: '',
  [_constants.typeKeys.IMAGE]: ''
};
exports.defaultValues = defaultValues;