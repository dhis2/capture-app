// @flow
import log from 'loglevel';
import isString from 'd2-utilizr/lib/isString';
// TODO: add some kind of errorcreator to d2 before moving
import { errorCreator } from '../../errorCreator';
import typeKeys from '../typeKeys.const';
import mapTypeToInterfaceFnName from '../typeToInterfaceFnName.const';
import trimQuotes from '../commonUtils/trimQuotes';

import type { IConvertInputRulesValue } from '../rulesEngine.types';

export default class ValueProcessor {
    static errorMessages = {
        CONVERTER_NOT_FOUND: 'converter for type is missing',
    };

    static addQuotesToValueIfString(value: any) {
        return isString(value) ? `'${value}'` : value;
    }

    converterObject: IConvertInputRulesValue;
    processValue: (value: any, type: $Values<typeof typeKeys>) => any;

    constructor(converterObject: IConvertInputRulesValue) {
        this.converterObject = converterObject;
        this.processValue = this.processValue.bind(this);
    }

    processValue(value: any, type: $Values<typeof typeKeys>): any {
        if (isString(value)) {
            value = trimQuotes(value);
        }

        const convertFnName = mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(ValueProcessor.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }
        // $FlowSuppress
        const convertedValue = ValueProcessor.addQuotesToValueIfString(this.converterObject[convertFnName](value));
        return convertedValue;
    }
}
