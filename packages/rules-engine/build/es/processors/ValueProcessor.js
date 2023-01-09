function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import log from 'loglevel'; // TODO: add some kind of errorcreator to d2 before moving

import { errorCreator } from '../errorCreator';
import { mapTypeToInterfaceFnName, typeKeys } from '../constants';
export class ValueProcessor {
  constructor(converterObject) {
    this.converterObject = converterObject;
    this.processValue = this.processValue.bind(this);
  }

  processValue(value, type) {
    if (!typeKeys[type]) {
      log.warn(ValueProcessor.errorMessages.TYPE_NOT_SUPPORTED);
      return '';
    }

    const convertFnName = mapTypeToInterfaceFnName[type];

    if (!convertFnName) {
      log.warn(errorCreator(ValueProcessor.errorMessages.CONVERTER_NOT_FOUND)({
        type
      }));
      return value;
    } // $FlowFixMe


    const convertedValue = this.converterObject[convertFnName] ? this.converterObject[convertFnName](value) : value;
    return convertedValue !== null && convertedValue !== void 0 ? convertedValue : null;
  }

}

_defineProperty(ValueProcessor, "errorMessages", {
  TYPE_NOT_SUPPORTED: 'value type not supported',
  CONVERTER_NOT_FOUND: 'converter for type is missing'
});