// @flow
import { errorCreator } from 'capture-core-utils/errorCreator';
import isString from 'd2-utilizr/lib/isString';
import log from 'loglevel';
// TODO: add some kind of errorcreator to d2 before moving
import { trimQuotes } from '../commonUtils/trimQuotes';
import { mapTypeToInterfaceFnName, typeof typeKeys } from '../constants';

import type { IConvertInputRulesValue } from '../rulesEngine.types';

export class ValueProcessor {
    static errorMessages = {
        CONVERTER_NOT_FOUND: 'converter for type is missing',
    };

    static addQuotesToValueIfString(value: any) {
        return isString(value) ? `'${value}'` : value;
    }

    converterObject: IConvertInputRulesValue;
    processValue: (value: any, type: $Values<typeKeys>) => any;

    constructor(converterObject: IConvertInputRulesValue) {
        this.converterObject = converterObject;
        this.processValue = this.processValue.bind(this);
    }

    processValue(value: any, type: $Values<typeKeys>): any {
        if (isString(value)) {
            value = trimQuotes(value);
        }

        // $FlowFixMe[prop-missing] automated comment
        const convertFnName = mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(ValueProcessor.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }

        // $FlowFixMe[incompatible-use] automated comment
        const convertedValue = ValueProcessor.addQuotesToValueIfString(this.converterObject[convertFnName](value));
        return convertedValue;
    }
}
