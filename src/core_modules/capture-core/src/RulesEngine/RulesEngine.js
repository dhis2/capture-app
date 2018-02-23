// @flow
import isString from 'd2-utilizr/lib/isString';
import log from 'loglevel';
import errorCreator from '../utils/errorCreator';
import typeKeys from './typeKeys.const';

import type { IConvertRulesValue, ProgramRulesContainer, EventData, EventsData } from './rulesEngine.types';

export default class RulesEngine {
    static mapTypeToInterfaceFnName = {
        [typeKeys.TEXT]: 'convertText',
        [typeKeys.LONG_TEXT]: 'convertLongText',
        [typeKeys.LETTER]: 'convertLetter',
        [typeKeys.PHONE_NUMBER]: 'convertPhoneNumber',
        [typeKeys.EMAIL]: 'convertEmail',
        [typeKeys.BOOLEAN]: 'convertBoolean',
        [typeKeys.TRUE_ONLY]: 'convertTrueOnly',
        [typeKeys.DATE]: 'convertDate',
        [typeKeys.DATETIME]: 'convertDateTime',
        [typeKeys.TIME]: 'convertTime',
        [typeKeys.NUMBER]: 'convertNumber',
        [typeKeys.INTEGER]: 'convertInteger',
        [typeKeys.INTEGER_POSITIVE]: 'convertIntegerPositive',
        [typeKeys.INTEGER_NEGATIVE]: 'convertIntegerNegative',
        [typeKeys.INTEGER_ZERO_OR_POSITIVE]: 'convertIntegerZeroOrPositive',
        [typeKeys.PERCENTAGE]: 'convertPercentage',
        [typeKeys.URL]: 'convertUrl',
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

    converterObject: IConvertRulesValue;

    constructor(converterObject: IConvertRulesValue) {
        this.converterObject = converterObject;
    }

    processValue(value: any, type: $Keys<typeof RulesEngine.mapTypeToInterfaceFnName>): any {
        if (isString(value)) {
            value = RulesEngine.trimQuotes(value);
        }

        const convertFnName = RulesEngine.mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(RulesEngine.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }
        // $FlowSuppress
        const convertedValue = RulesEngine.addQuotesToValueIfString(this.converterObject[convertFnName](value));
        return convertedValue;
    }

    executeRules(
        allProgramRules: ProgramRulesContainer,
        executingEventValues: EventData,
        eventsValues: EventsData,
        dataElements: { [elementId: string]: DataElementForRulesEngine }) {
            
    }
}
