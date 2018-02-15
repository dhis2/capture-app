// @flow
/* eslint-disable no-underscore-dangle */
import isString from 'd2-utilizr/lib/isString';
import log from 'loglevel';
import errorCreator from '../utils/errorCreator';

export interface IConvertRulesValue {
    convertText(value: any): string;
    convertLongText(value: any): string;
    convertLetter(value: any): string;
    convertPhoneNumber(value: any): string;
    convertEmail(value: any): string;
    convertBoolean(value: any): boolean;
    convertTrueOnly(value: any): boolean;
    convertDate(value: any): string;
    convertDateTime(value: any): string;
    convertTime(value: any): string;
    convertNumber(value: any): number;
    convertInteger(value: any): number;
    convertIntegerPositive(value: any): number;
    convertIntegerNegative(value: any): number;
    convertIntegerZeroOrPositive(value: any): number;
    convertPercentage(value: any): number;
    convertUrl(value: any): string;
}

export default class RulesEngine {
    static mapTypeToInterfaceFnName = {
        TEXT: 'convertText',
        LONG_TEXT: 'convertLongText',
        LETTER: 'convertLetter',
        PHONE_NUMBER: 'convertPhoneNumber',
        EMAIL: 'convertEmail',
        BOOLEAN: 'convertBoolean',
        TRUE_ONLY: 'convertTrueOnly',
        DATE: 'convertDate',
        DATETIME: 'convertDateTime',
        TIME: 'convertTime',
        NUMBER: 'convertNumber',
        INTEGER: 'convertInteger',
        INTEGER_POSITIVE: 'convertIntegerPositive',
        INTEGER_NEGATIVE: 'convertIntegerNegative',
        INTEGER_ZERO_OR_POSITIVE: 'convertIntegerZeroOrPositive',
        PERCENTAGE: 'convertPercentage',
        URL: 'convertUrl',
    };

    static errorMessages = {
        CONVERTER_NOT_FOUND: 'converter for type is missing',
    };

    static addQuotesToValueIfString(value: any) {
        return isString(value) ? `"${value}"` : value;
    }

    _converterObject: IConvertRulesValue;

    constructor(converterObject: IConvertRulesValue) {
        this._converterObject = converterObject;
    }

    processValue(value: any, type: $Keys<typeof RulesEngine.mapTypeToInterfaceFnName>) {
        const convertFnName = RulesEngine.mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(RulesEngine.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }
        // $FlowSuppress
        const convertedValue = RulesEngine.addQuotesToValueIfString(this._converterObject[convertFnName](value));
        return convertedValue;
    }

    executeRules() {
        
    }
}
