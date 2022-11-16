"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapTypeToInterfaceFnName = void 0;

var _typeKeys = require("./typeKeys.const");

const mapTypeToInterfaceFnName = {
  [_typeKeys.typeKeys.TEXT]: 'convertText',
  [_typeKeys.typeKeys.LONG_TEXT]: 'convertLongText',
  [_typeKeys.typeKeys.LETTER]: 'convertLetter',
  [_typeKeys.typeKeys.PHONE_NUMBER]: 'convertPhoneNumber',
  [_typeKeys.typeKeys.EMAIL]: 'convertEmail',
  [_typeKeys.typeKeys.BOOLEAN]: 'convertBoolean',
  [_typeKeys.typeKeys.TRUE_ONLY]: 'convertTrueOnly',
  [_typeKeys.typeKeys.DATE]: 'convertDate',
  [_typeKeys.typeKeys.DATETIME]: 'convertDateTime',
  [_typeKeys.typeKeys.TIME]: 'convertTime',
  [_typeKeys.typeKeys.NUMBER]: 'convertNumber',
  [_typeKeys.typeKeys.INTEGER]: 'convertInteger',
  [_typeKeys.typeKeys.INTEGER_POSITIVE]: 'convertIntegerPositive',
  [_typeKeys.typeKeys.INTEGER_NEGATIVE]: 'convertIntegerNegative',
  [_typeKeys.typeKeys.INTEGER_ZERO_OR_POSITIVE]: 'convertIntegerZeroOrPositive',
  [_typeKeys.typeKeys.PERCENTAGE]: 'convertPercentage',
  [_typeKeys.typeKeys.URL]: 'convertUrl',
  [_typeKeys.typeKeys.AGE]: 'convertAge',
  [_typeKeys.typeKeys.FILE_RESOURCE]: 'convertFile',
  [_typeKeys.typeKeys.ORGANISATION_UNIT]: 'convertOrganisationUnit',
  [_typeKeys.typeKeys.IMAGE]: 'convertImage',
  [_typeKeys.typeKeys.USERNAME]: 'convertUserName',
  [_typeKeys.typeKeys.COORDINATE]: 'convertCoordinate'
};
exports.mapTypeToInterfaceFnName = mapTypeToInterfaceFnName;