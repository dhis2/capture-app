// @flow
import log from 'loglevel';
import isString from 'd2-utilizr/lib/isString';
// TODO: add some kind of errorcreator to d2 before moving
import errorCreator from '../../utils/errorCreator';
import typeKeys from '../typeKeys.const';
import trimQuotes from '../commonUtils/trimQuotes';

import type { IConvertRulesValue } from '../rulesEngine.types';

export default class ValueProcessor {
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

    converterObject: IConvertRulesValue;
    processValue: (value: any, type: $Values<typeof typeKeys>) => any;

    constructor(converterObject: IConvertRulesValue) {
        this.converterObject = converterObject;
        this.processValue = this.processValue.bind(this);
    }

    processValue(value: any, type: $Values<typeof typeKeys>): any {
        if (isString(value)) {
            value = trimQuotes(value);
        }

        const convertFnName = ValueProcessor.mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(ValueProcessor.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }
        // $FlowSuppress
        const convertedValue = ValueProcessor.addQuotesToValueIfString(this.converterObject[convertFnName](value));
        return convertedValue;
    }
}
