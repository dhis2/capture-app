"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValueProcessor = void 0;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _errorCreator = require("../errorCreator");

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ValueProcessor {
  constructor(converterObject) {
    this.converterObject = converterObject;
    this.processValue = this.processValue.bind(this);
  }

  processValue(value, type) {
    if (!_constants.typeKeys[type]) {
      _loglevel.default.warn(ValueProcessor.errorMessages.TYPE_NOT_SUPPORTED);

      return '';
    }

    const convertFnName = _constants.mapTypeToInterfaceFnName[type];

    if (!convertFnName) {
      _loglevel.default.warn((0, _errorCreator.errorCreator)(ValueProcessor.errorMessages.CONVERTER_NOT_FOUND)({
        type
      }));

      return value;
    } // $FlowFixMe


    const convertedValue = this.converterObject[convertFnName] ? this.converterObject[convertFnName](value) : value;
    return convertedValue !== null && convertedValue !== void 0 ? convertedValue : null;
  }

}

exports.ValueProcessor = ValueProcessor;

_defineProperty(ValueProcessor, "errorMessages", {
  TYPE_NOT_SUPPORTED: 'value type not supported',
  CONVERTER_NOT_FOUND: 'converter for type is missing'
});