"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getD2Functions = void 0;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _zScoreFunctions = require("./zScoreFunctions");

var _gs1DataMatrixFuntions = require("./gs1DataMatrixFuntions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getD2Functions = _ref => {
  let {
    dateUtils,
    variablesHash,
    selectedOrgUnit,
    selectedUserRoles
  } = _ref;
  return {
    ceil: {
      parameters: 1,
      execute: params => Math.ceil(params[0])
    },
    floor: {
      parameters: 1,
      execute: params => Math.floor(params[0])
    },
    round: {
      parameters: {
        min: 1,
        max: 2
      },
      execute: params => {
        if (params[1]) {
          const decimalCorrection = 10 ** Math.round(params[1]);
          return Math.round((params[0] + Number.EPSILON) * decimalCorrection) / decimalCorrection;
        }

        return Math.round(params[0]);
      }
    },
    modulus: {
      parameters: 2,
      execute: params => {
        const dividend = Number(params[0]);
        const divisor = Number(params[1]);
        const rest = dividend % divisor;
        return rest;
      }
    },
    zing: {
      parameters: 1,
      execute: params => {
        const number = params[0];
        return number < 0 ? 0 : number;
      }
    },
    oizp: {
      parameters: 1,
      execute: params => params[0] < 0 ? 0 : 1
    },
    concatenate: {
      execute: params => params.join('')
    },
    daysBetween: {
      parameters: 2,
      execute: params => dateUtils.daysBetween(params[0], params[1])
    },
    weeksBetween: {
      parameters: 2,
      execute: params => dateUtils.weeksBetween(params[0], params[1])
    },
    monthsBetween: {
      parameters: 2,
      execute: params => dateUtils.monthsBetween(params[0], params[1])
    },
    yearsBetween: {
      parameters: 2,
      execute: params => dateUtils.yearsBetween(params[0], params[1])
    },
    addDays: {
      parameters: 2,
      execute: params => {
        const date = params[0];
        const daysToAdd = params[1];
        return dateUtils.addDays(date, daysToAdd);
      }
    },
    count: {
      parameters: 1,
      execute: params => {
        var _variable$allValues$l, _variable$allValues;

        const variableName = params[0];
        const variable = variablesHash[variableName];

        if (!variable) {
          _loglevel.default.warn("could not find variable to count: ".concat(variableName));

          return 0;
        }

        return variable.hasValue ? (_variable$allValues$l = (_variable$allValues = variable.allValues) === null || _variable$allValues === void 0 ? void 0 : _variable$allValues.length) !== null && _variable$allValues$l !== void 0 ? _variable$allValues$l : 1 : 0;
      }
    },
    countIfValue: {
      parameters: 2,
      execute: params => {
        const variableName = params[0];
        const variable = variablesHash[variableName];

        if (!variable) {
          _loglevel.default.warn("could not find variable to countIfValue: ".concat(variableName));

          return 0;
        }

        if (!variable.hasValue) {
          return 0;
        }

        const valueToCompare = params[1];
        return (variable.allValues || [variable.variableValue]).reduce((acc, value) => value === valueToCompare ? acc + 1 : acc, 0);
      }
    },
    countIfZeroPos: {
      parameters: 1,
      execute: () => {
        _loglevel.default.warn('countIfZeroPos not implemented yet');

        return 0;
      }
    },
    hasValue: {
      parameters: 1,
      execute: params => {
        const variableName = params[0];
        const variable = variablesHash[variableName];

        if (!variable) {
          _loglevel.default.warn("could not find variable to check if has value: ".concat(variableName));

          return false;
        }

        return variable.hasValue;
      }
    },
    validatePattern: {
      parameters: 2,
      execute: params => {
        const inputToValidate = params[0].toString();
        const pattern = params[1];
        const regEx = new RegExp(pattern, 'g');
        const match = inputToValidate.match(regEx);
        let matchFound = false;

        if (match !== null && inputToValidate === match[0]) {
          matchFound = true;
        }

        return matchFound;
      }
    },
    left: {
      parameters: 2,
      execute: params => {
        const string = String(params[0]);
        const numChars = string.length < params[1] ? string.length : params[1];
        return string.substring(0, numChars);
      }
    },
    right: {
      parameters: 2,
      execute: params => {
        const string = String(params[0]);
        const numChars = string.length < params[1] ? string.length : params[1];
        return string.substring(string.length - numChars, string.length);
      }
    },
    substring: {
      parameters: 3,
      execute: params => {
        const string = String(params[0]);
        const startChar = string.length < params[1] - 1 ? -1 : params[1];
        const endChar = string.length < params[2] ? -1 : params[2];

        if (startChar < 0 || endChar < 0) {
          return '';
        }

        return string.substring(startChar, endChar);
      }
    },
    split: {
      parameters: 3,
      execute: params => {
        const string = String(params[0]);
        const splitArray = string.split(params[1]);
        let returnPart = '';

        if (splitArray.length > params[2]) {
          returnPart = splitArray[params[2]];
        }

        return returnPart;
      }
    },
    length: {
      parameters: 1,
      execute: params => String(params[0]).length
    },
    inOrgUnitGroup: {
      parameters: 1,
      execute: params => {
        const group = params[0];
        const orgUnitGroups = selectedOrgUnit && selectedOrgUnit.groups || [];
        return Boolean(orgUnitGroups.find(o => o.id === group || o.code === group));
      }
    },
    hasUserRole: {
      parameters: 1,
      execute: params => {
        const role = params[0];
        return selectedUserRoles.includes(role);
      }
    },
    zScoreWFA: {
      parameters: 3,
      execute: params => (0, _zScoreFunctions.getZScoreWFA)(params[0], params[1], params[2])
    },
    zScoreHFA: {
      parameters: 3,
      execute: params => (0, _zScoreFunctions.getZScoreHFA)(params[0], params[1], params[2])
    },
    zScoreWFH: {
      parameters: 3,
      execute: params => (0, _zScoreFunctions.getZScoreWFH)(params[0], params[1], params[2])
    },
    extractDataMatrixValue: {
      parameters: 2,
      execute: params => (0, _gs1DataMatrixFuntions.extractDataMatrixValue)(params[0], params[1])
    },
    lastEventDate: {
      parameters: 1,
      execute: params => {
        const variableName = params[0];
        const variable = variablesHash[variableName];

        if (!variable) {
          _loglevel.default.warn("could not find variable to check last event date: ".concat(variableName));

          return '';
        }

        if (!variable.variableEventDate) {
          _loglevel.default.warn("no last event date found for variable: ".concat(variableName));

          return '';
        }

        return variable.variableEventDate;
      }
    },
    addControlDigits: {
      parameters: 1,
      execute: params => {
        const baseNumber = params[0];
        const baseDigits = baseNumber.split('');
        const error = false;
        let firstDigit = 0;
        let secondDigit = 0;

        if (baseDigits && baseDigits.length < 10) {
          let firstSum = 0;
          const baseNumberLength = baseDigits.length; // weights support up to 9 base digits:

          const firstWeights = [3, 7, 6, 1, 8, 9, 4, 5, 2];

          for (let i = 0; i < baseNumberLength && !error; i++) {
            firstSum += parseInt(baseDigits[i], 10) * firstWeights[i];
          }

          firstDigit = firstSum % 11; // Push the first digit to the array before continuing, as the second digit is a result of the
          // base digits and the first control digit.

          baseDigits.push(firstDigit); // Weights support up to 9 base digits plus first control digit:

          const secondWeights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
          let secondSum = 0;

          for (let si = 0; si < baseNumberLength + 1 && !error; si++) {
            secondSum += parseInt(baseDigits[si], 10) * secondWeights[si];
          }

          secondDigit = secondSum % 11;

          if (firstDigit === 10) {
            _loglevel.default.warn('First control digit became 10, replacing with 0');

            firstDigit = 0;
          }

          if (secondDigit === 10) {
            _loglevel.default.warn('Second control digit became 10, replacing with 0');

            secondDigit = 0;
          }
        } else {
          _loglevel.default.warn("Base number not well formed(".concat(baseDigits.length, " digits): ").concat(baseNumber));
        }

        if (!error) {
          // Replace the end evaluation of the dhis function:
          return baseNumber + firstDigit + secondDigit;
        } // Replace the end evaluation of the dhis function:


        return baseNumber;
      }
    },
    checkControlDigits: {
      parameters: 1,
      execute: params => {
        _loglevel.default.warn('checkControlDigits not implemented yet');

        return params[0];
      }
    }
  };
};

exports.getD2Functions = getD2Functions;