// @flow
import log from 'loglevel';
import { getZScoreWFA, getZScoreWFH, getZScoreHFA } from './zScoreFunctions';
import { extractDataMatrixValue } from './gs1DataMatrixFuntions';
import { executeExpression } from '../services/expressionService';
import type { D2FunctionsInput, D2Functions } from './getD2Functions.types';


export const getD2Functions = ({
    dateUtils,
    variablesHash,
    selectedOrgUnit,
    selectedUserRoles,
}: D2FunctionsInput): D2Functions => ({
    ceil: {
        parameters: 1,
        execute: (params: any) => Math.ceil(params[0]),
    },
    floor: {
        parameters: 1,
        execute: (params: any) => Math.floor(params[0]),
    },
    round: {
        parameters: { min: 1, max: 2 },
        execute: (params: any) => {
            if (params[1]) {
                const decimalCorrection = 10 ** Math.round(params[1]);
                return Math.round((params[0] + Number.EPSILON) * decimalCorrection) / decimalCorrection;
            }
            return Math.round(params[0]);
        },
    },
    modulus: {
        parameters: 2,
        execute: (params: any) => {
            const dividend = Number(params[0]);
            const divisor = Number(params[1]);
            const rest = dividend % divisor;
            return rest;
        },
    },
    zing: {
        parameters: 1,
        execute: (params: any) => {
            const number = params[0];
            return number < 0 ? 0 : number;
        },
    },
    oizp: {
        parameters: 1,
        execute: (params: any) => (params[0] < 0 ? 0 : 1),
    },
    concatenate: {
        execute: (params: any) => params.join(''),
    },
    daysBetween: {
        parameters: 2,
        execute: (params: any) => dateUtils.daysBetween(params[0], params[1]),
    },
    weeksBetween: {
        parameters: 2,
        execute: (params: any) => dateUtils.weeksBetween(params[0], params[1]),
    },
    monthsBetween: {
        parameters: 2,
        execute: (params: any) => dateUtils.monthsBetween(params[0], params[1]),
    },
    yearsBetween: {
        parameters: 2,
        execute: (params: any) => dateUtils.yearsBetween(params[0], params[1]),
    },
    addDays: {
        parameters: 2,
        execute: (params: any) => {
            const date = params[0];
            const daysToAdd = params[1];
            return dateUtils.addDays(date, daysToAdd);
        },
    },
    count: {
        parameters: 1,
        execute: (params: any) => {
            const variableName = params[0];
            const variable = variablesHash[variableName];
            if (!variable) {
                log.warn(`could not find variable to count: ${variableName}`);
                return 0;
            }

            return variable.hasValue ? variable.allValues?.length ?? 1 : 0;
        },
    },
    countIfValue: {
        parameters: 2,
        execute: (params: any) => {
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
    countIfZeroPos: {
        parameters: 1,
        execute: () => {
            log.warn('countIfZeroPos not implemented yet');
            return 0;
        },
    },
    hasValue: {
        parameters: 1,
        execute: (params: any) => {
            const variableName = params[0];
            const variable = variablesHash[variableName];
            if (!variable) {
                log.warn(`could not find variable to check if has value: ${variableName}`);
                return false;
            }

            return variable.hasValue;
        },
    },
    validatePattern: {
        parameters: 2,
        execute: (params: any) => {
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
    left: {
        parameters: 2,
        execute: (params: any) => {
            const string = String(params[0]);
            const numChars = string.length < params[1] ? string.length : params[1];
            return string.substring(0, numChars);
        },
    },
    right: {
        parameters: 2,
        execute: (params: any) => {
            const string = String(params[0]);
            const numChars = string.length < params[1] ? string.length : params[1];
            return string.substring(string.length - numChars, string.length);
        },
    },
    substring: {
        parameters: 3,
        execute: (params: any) => {
            const string = String(params[0]);
            const startChar = string.length < params[1] - 1 ? -1 : params[1];
            const endChar = string.length < params[2] ? -1 : params[2];
            if (startChar < 0 || endChar < 0) {
                return '';
            }
            return string.substring(startChar, endChar);
        },
    },
    split: {
        parameters: 3,
        execute: (params: any) => {
            const string = String(params[0]);
            const splitArray = string.split(params[1]);
            let returnPart = '';
            if (splitArray.length > params[2]) {
                returnPart = splitArray[params[2]];
            }
            return returnPart;
        },
    },
    length: {
        parameters: 1,
        execute: (params: any) => String(params[0]).length,
    },
    inOrgUnitGroup: {
        parameters: 1,
        execute: (params: any) => {
            const group = params[0];
            const orgUnitGroups = (selectedOrgUnit && selectedOrgUnit.groups) || [];
            return Boolean(orgUnitGroups.find(o => o.id === group || o.code === group));
        },
    },
    hasUserRole: {
        parameters: 1,
        execute: (params: any) => {
            const role = params[0];
            return selectedUserRoles.includes(role);
        },
    },
    zScoreWFA: {
        parameters: 3,
        execute: (params: any) => getZScoreWFA(params[0], params[1], params[2]),
    },
    zScoreHFA: {
        parameters: 3,
        execute: (params: any) => getZScoreHFA(params[0], params[1], params[2]),
    },
    zScoreWFH: {
        parameters: 3,
        execute: (params: any) => getZScoreWFH(params[0], params[1], params[2]),
    },
    extractDataMatrixValue: {
        parameters: 2,
        execute: (params: any) => extractDataMatrixValue(params[0], params[1]),
    },
    lastEventDate: {
        parameters: 1,
        execute: (params: any) => {
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
    addControlDigits: {
        parameters: 1,
        execute: (params: any) => {
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
    checkControlDigits: {
        parameters: 1,
        execute: (params: any) => {
            log.warn('checkControlDigits not implemented yet');
            return params[0];
        },
    },
    multiTextContains: {
        parameters: 2,
        execute: (params: any) => {
            log.warn('multiTextContains not implemented yet');
            return params[0];
        },
    },
    condition: {
        parameters: 3,
        execute: (params: any) => {
            // The expression in params[0] was wrapped in quotation marks,
            // so we need to evaluate it using executeExpression.
            const dhisFunctions: D2Functions = getD2Functions({
                dateUtils,
                variablesHash,
                selectedOrgUnit,
                selectedUserRoles,
            });
            const result = executeExpression({
                expression: params[0],
                dhisFunctions,
                variablesHash,
                onError: () => log.error(`Evaluation of d2:condition expression ${params[0]} failed`),
                onVerboseLog: () => {},
            });
            return result ? params[1] : params[2];
        },
    },
});
