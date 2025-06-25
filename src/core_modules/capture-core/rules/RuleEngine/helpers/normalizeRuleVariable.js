// @flow
import log from 'loglevel';
import isString from 'd2-utilizr/lib/isString';
import { typeKeys } from '../constants';

const convertNumber = (numberRepresentation) => {
    if (isString(numberRepresentation)) {
        if (isNaN(numberRepresentation)) {
            log.warn(`rule execution service could not convert ${numberRepresentation} to number`);
            return null;
        }
        return Number(numberRepresentation);
    }
    return numberRepresentation;
};

const convertBoolean = (value) => {
    if (isString(value)) {
        return value === 'true';
    }
    return value;
};

const convertString = (stringRepresentation: number | string): string => stringRepresentation.toString();

// Turns the internal representation of a program rule variable into its "canonical" format
// (e.g. numbers represented as strings get converted to numbers)
// Used to preprocess a computed value before assigning it to a calculated program rule variable
export const normalizeRuleVariable = (data: any, valueType: string) => {
    const ruleEffectDataConvertersByType = {
        [typeKeys.BOOLEAN]: convertBoolean,
        [typeKeys.TRUE_ONLY]: convertBoolean,
        [typeKeys.PERCENTAGE]: convertString,
        [typeKeys.INTEGER]: convertNumber,
        [typeKeys.INTEGER_NEGATIVE]: convertNumber,
        [typeKeys.INTEGER_POSITIVE]: convertNumber,
        [typeKeys.INTEGER_ZERO_OR_POSITIVE]: convertNumber,
        [typeKeys.NUMBER]: convertNumber,
        [typeKeys.AGE]: convertString,
        [typeKeys.TEXT]: convertString,
        [typeKeys.LONG_TEXT]: convertString,
        [typeKeys.MULTI_TEXT]: convertString,
    };

    if (!data && data !== 0 && data !== false) {
        return null;
    }

    return ruleEffectDataConvertersByType[valueType] ? ruleEffectDataConvertersByType[valueType](data) : data;
};
