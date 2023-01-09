"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeRuleVariable = void 0;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _isString = _interopRequireDefault(require("d2-utilizr/lib/isString"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const convertNumber = numberRepresentation => {
  if ((0, _isString.default)(numberRepresentation)) {
    if (isNaN(numberRepresentation)) {
      _loglevel.default.warn("rule execution service could not convert ".concat(numberRepresentation, " to number"));

      return null;
    }

    return Number(numberRepresentation);
  }

  return numberRepresentation;
};

const convertBoolean = value => {
  if ((0, _isString.default)(value)) {
    return value === 'true';
  }

  return value;
};

const convertString = stringRepresentation => stringRepresentation.toString(); // Turns the internal representation of a program rule variable into its "canonical" format
// (e.g. numbers represented as strings get converted to numbers)
// Used to preprocess a computed value before assigning it to a calculated program rule variable


const normalizeRuleVariable = (data, valueType) => {
  const ruleEffectDataConvertersByType = {
    [_constants.typeKeys.BOOLEAN]: convertBoolean,
    [_constants.typeKeys.TRUE_ONLY]: convertBoolean,
    [_constants.typeKeys.PERCENTAGE]: convertString,
    [_constants.typeKeys.INTEGER]: convertNumber,
    [_constants.typeKeys.INTEGER_NEGATIVE]: convertNumber,
    [_constants.typeKeys.INTEGER_POSITIVE]: convertNumber,
    [_constants.typeKeys.INTEGER_ZERO_OR_POSITIVE]: convertNumber,
    [_constants.typeKeys.NUMBER]: convertNumber,
    [_constants.typeKeys.AGE]: convertString,
    [_constants.typeKeys.TEXT]: convertString,
    [_constants.typeKeys.LONG_TEXT]: convertString
  };

  if (!data && data !== 0 && data !== false) {
    return null;
  }

  return ruleEffectDataConvertersByType[valueType] ? ruleEffectDataConvertersByType[valueType](data) : data;
};

exports.normalizeRuleVariable = normalizeRuleVariable;