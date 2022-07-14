import log from 'loglevel';
import { getZScoreWFA, getZScoreWFH, getZScoreHFA } from './zScoreFunctions';
import { extractDataMatrixValue } from './gs1DataMatrixFuntions';

export const d2Functions = ({ dateUtils, variablesHash, selectedOrgUnit, selectedUserRoles }) => ({
    'd2:ceil': {
        name: 'd2:ceil',
        parameters: 1,
        dhisFunction: params => Math.ceil(params[0]),
    },
    'd2:floor': {
        name: 'd2:floor',
        parameters: 1,
        dhisFunction: params => Math.floor(params[0]),
    },
    'd2:round': {
        name: 'd2:round',
        parameters: 1,
        dhisFunction: params => Math.round(params[0]),
    },
    'd2:modulus': {
        name: 'd2:modulus',
        parameters: 2,
        dhisFunction: (params) => {
            const dividend = Number(params[0]);
            const divisor = Number(params[1]);
            const rest = dividend % divisor;
            return rest;
        },
    },
    'd2:zing': {
        name: 'd2:zing',
        parameters: 1,
        dhisFunction: (params) => {
            const number = params[0];
            return number < 0 ? 0 : number;
        },
    },
    'd2:oizp': {
        name: 'd2:oizp',
        parameters: 1,
        dhisFunction: params => (params[0] < 0 ? 0 : 1),
    },
    'd2:concatenate': {
        name: 'd2:concatenate',
        dhisFunction: params => params.join(''),
    },
    'd2:daysBetween': {
        name: 'd2:daysBetween',
        parameters: 2,
        dhisFunction: params => dateUtils.daysBetween(params[0], params[1]),
    },
    'd2:weeksBetween': {
        name: 'd2:weeksBetween',
        parameters: 2,
        dhisFunction: params => dateUtils.weeksBetween(params[0], params[1]),
    },
    'd2:monthsBetween': {
        name: 'd2:monthsBetween',
        parameters: 2,
        dhisFunction: params => dateUtils.monthsBetween(params[0], params[1]),
    },
    'd2:yearsBetween': {
        name: 'd2:yearsBetween',
        parameters: 2,
        dhisFunction: params => dateUtils.yearsBetween(params[0], params[1]),
    },
    'd2:addDays': {
        name: 'd2:addDays',
        parameters: 2,
        dhisFunction: (params) => {
            const date = params[0];
            const daysToAdd = params[1];
            return dateUtils.addDays(date, daysToAdd);
        },
    },
    'd2:count': {
        name: 'd2:count',
        parameters: 1,
        dhisFunction: (params) => {
            const variableName = params[0];
            const variable = variablesHash[variableName];
            if (!variable) {
                log.warn(`could not find variable to count: ${variableName}`);
                return 0;
            }

            return variable.hasValue ? variable.allValues?.length ?? 1 : 0;
        },
    },
    'd2:countIfValue': {
        name: 'd2:countIfValue',
        parameters: 2,
        dhisFunction: (params) => {
            const variableName = params[0];
            const variable = variablesHash[variableName];
            if (!variable) {
                log.warn(`could not find variable to countIfValue: ${variableName}`);
                return 0;
            }

            if (!variable.hasValue) {
                return 0;
            }

            const valueToCompare = params[1];
            return (variable.allValues || [variable.variableValue])
                .reduce((acc, value) => (value === valueToCompare ? acc + 1 : acc), 0);
        },
    },
    'd2:countIfZeroPos': {
        name: 'd2:countIfZeroPos',
        parameters: 1,
        dhisFunction: () => {
            log.warn('countIfZeroPos not implemented yet');
            return 0;
        },
    },
    'd2:hasValue': {
        name: 'd2:hasValue',
        parameters: 1,
        dhisFunction: (params) => {
            const variableName = params[0];
            const variable = variablesHash[variableName];
            if (!variable) {
                log.warn(`could not find variable to check if has value: ${variableName}`);
                return false;
            }

            return variable.hasValue;
        },
    },
    'd2:validatePattern': {
        name: 'd2:validatePattern',
        parameters: 2,
        dhisFunction: (params) => {
            const inputToValidate = params[0].toString();
            const pattern = params[1];
            const regEx = new RegExp(pattern, 'g');
            const match = inputToValidate.match(regEx);

            let matchFound = false;
            if (match !== null && inputToValidate === match[0]) {
                matchFound = true;
            }
            return matchFound;
        },
    },
    'd2:left': {
        name: 'd2:left',
        parameters: 2,
        dhisFunction: (params) => {
            const string = String(params[0]);
            const numChars = string.length < params[1] ? string.length : params[1];
            return string.substring(0, numChars);
        },
    },
    'd2:right': {
        name: 'd2:right',
        parameters: 2,
        dhisFunction: (params) => {
            const string = String(params[0]);
            const numChars = string.length < params[1] ? string.length : params[1];
            return string.substring(string.length - numChars, string.length);
        },
    },
    'd2:substring': {
        name: 'd2:substring',
        parameters: 3,
        dhisFunction: (params) => {
            const string = String(params[0]);
            const startChar = string.length < params[1] - 1 ? -1 : params[1];
            const endChar = string.length < params[2] ? -1 : params[2];
            if (startChar < 0 || endChar < 0) {
                return '';
            }
            return string.substring(startChar, endChar);
        },
    },
    'd2:split': {
        name: 'd2:split',
        parameters: 3,
        dhisFunction: (params) => {
            const string = String(params[0]);
            const splitArray = string.split(params[1]);
            let returnPart = '';
            if (splitArray.length > params[2]) {
                returnPart = splitArray[params[2]];
            }
            return returnPart;
        },
    },
    'd2:length': {
        name: 'd2:length',
        parameters: 1,
        dhisFunction: params => String(params[0]).length,
    },
    'd2:inOrgUnitGroup': {
        name: 'd2:inOrgUnitGroup',
        parameters: 1,
        dhisFunction: (params) => {
            const group = params[0];
            const orgUnitGroups = (selectedOrgUnit && selectedOrgUnit.groups) || [];
            return Boolean(orgUnitGroups.find(o => o.id === group || o.code === group));
        },
    },
    'd2:hasUserRole': {
        name: 'd2:hasUserRole',
        parameters: 1,
        dhisFunction: (params) => {
            const role = params[0];
            return selectedUserRoles.includes(role);
        },
    },
    'd2:zScoreWFA': {
        name: 'd2:zScoreWFA',
        parameters: 3,
        dhisFunction: params => getZScoreWFA(params[0], params[1], params[2]),
    },
    'd2:zScoreHFA': {
        name: 'd2:zScoreHFA',
        parameters: 3,
        dhisFunction: params => getZScoreHFA(params[0], params[1], params[2]),
    },
    'd2:zScoreWFH': {
        name: 'd2:zScoreWFH',
        parameters: 3,
        dhisFunction: params => getZScoreWFH(params[0], params[1], params[2]),
    },
    'd2:extractDataMatrixValue': {
        name: 'd2:extractDataMatrixValue',
        parameters: 2,
        dhisFunction: params => extractDataMatrixValue(params[0], params[1]),
    },
    'd2:lastEventDate': {
        name: 'd2:lastEventDate',
        parameters: 1,
        dhisFunction: (params) => {
            const variableName = params[0];
            const variable = variablesHash[variableName];

            if (!variable) {
                log.warn(`could not find variable to check last event date: ${variableName}`);
                return '';
            }

            if (!variable.variableEventDate) {
                log.warn(`no last event date found for variable: ${variableName}`);
                return '';
            }

            return variable.variableEventDate;
        },
    },
    'd2:addControlDigits': {
        name: 'd2:addControlDigits',
        parameters: 1,
        dhisFunction: (params) => {
            const baseNumber = params[0];
            const baseDigits = baseNumber.split('');
            const error = false;

            let firstDigit = 0;
            let secondDigit = 0;

            if (baseDigits && baseDigits.length < 10) {
                let firstSum = 0;
                const baseNumberLength = baseDigits.length;
                // weights support up to 9 base digits:
                const firstWeights = [3, 7, 6, 1, 8, 9, 4, 5, 2];
                for (let i = 0; i < baseNumberLength && !error; i++) {
                    firstSum += parseInt(baseDigits[i], 10) * firstWeights[i];
                }
                firstDigit = firstSum % 11;

                // Push the first digit to the array before continuing, as the second digit is a result of the
                // base digits and the first control digit.
                baseDigits.push(firstDigit);
                // Weights support up to 9 base digits plus first control digit:
                const secondWeights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
                let secondSum = 0;
                for (let si = 0; si < baseNumberLength + 1 && !error; si++) {
                    secondSum += parseInt(baseDigits[si], 10) * secondWeights[si];
                }
                secondDigit = secondSum % 11;

                if (firstDigit === 10) {
                    log.warn('First control digit became 10, replacing with 0');
                    firstDigit = 0;
                }
                if (secondDigit === 10) {
                    log.warn('Second control digit became 10, replacing with 0');
                    secondDigit = 0;
                }
            } else {
                log.warn(`Base number not well formed(${baseDigits.length} digits): ${baseNumber}`);
            }

            if (!error) {
                // Replace the end evaluation of the dhis function:
                return baseNumber + firstDigit + secondDigit;
            }
            // Replace the end evaluation of the dhis function:
            return baseNumber;
        },
    },
    'd2:checkControlDigits': {
        name: 'd2:checkControlDigits',
        parameters: 1,
        dhisFunction: (params) => {
            log.warn('checkControlDigits not implemented yet');
            return params[0];
        },
    },
});
