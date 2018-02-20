// @flow
/* eslint-disable no-underscore-dangle */
import isString from 'd2-utilizr/lib/isString';
import log from 'loglevel';
import errorCreator from '../utils/errorCreator';

import type { IConvertRulesValue, ProgramRulesContainer, EventData, EventsData } from './rulesEngine.types';

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

    static trimQuotes(input: string) {
        let trimmingComplete = false;
        let beingTrimmed = input;

        while (!trimmingComplete) {
            const beforeTrimming = beingTrimmed;
            beingTrimmed = beingTrimmed.replace(/^'/, '').replace(/'$/, '');
            beingTrimmed = beingTrimmed.replace(/^"/, '').replace(/"$/, '');

            if (beforeTrimming.length === beingTrimmed.length) {
                trimmingComplete = true;
            }
        }
        return beingTrimmed;
    }

    _converterObject: IConvertRulesValue;

    constructor(converterObject: IConvertRulesValue) {
        this._converterObject = converterObject;
    }

    processValue(value: any, type: $Keys<typeof RulesEngine.mapTypeToInterfaceFnName>) {
        if (isString(value)) {
            value = RulesEngine.trimQuotes(value);
        }

        const convertFnName = RulesEngine.mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(RulesEngine.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }
        // $FlowSuppress
        const convertedValue = RulesEngine.addQuotesToValueIfString(this._converterObject[convertFnName](value));
        return convertedValue;
    }



    executeRules(
        allProgramRules: ProgramRulesContainer,
        executingEventValues: EventData,
        eventsValues: EventsData,
        allDataElements: DataElement) {

    }
}
