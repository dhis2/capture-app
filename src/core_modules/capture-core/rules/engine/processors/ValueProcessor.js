// @flow
import log from 'loglevel';
// TODO: add some kind of errorcreator to d2 before moving
import { errorCreator } from '../../../../capture-core-utils/errorCreator';
import typeKeys from '../typeKeys.const';
import mapTypeToInterfaceFnName from '../typeToInterfaceFnName.const';

import type { IConvertInputRulesValue } from '../rulesEngine.types';

export default class ValueProcessor {
    static errorMessages = {
        TYPE_NOT_SUPPORTED: 'value type not supported',
        CONVERTER_NOT_FOUND: 'converter for type is missing',
    };

    converterObject: IConvertInputRulesValue;
    processValue: (value: any, type: $Values<typeof typeKeys>) => any;

    constructor(converterObject: IConvertInputRulesValue) {
        this.converterObject = converterObject;
        this.processValue = this.processValue.bind(this);
    }

    processValue(value: any, type: $Values<typeof typeKeys>): any {
        if (!typeKeys[type]) {
            log.warn(ValueProcessor.errorMessages.TYPE_NOT_SUPPORTED);
            return '';
        }
        // $FlowFixMe
        const convertFnName = mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(ValueProcessor.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }
        // $FlowFixMe
        const convertedValue = this.converterObject[convertFnName] ? this.converterObject[convertFnName](value) : value;
        return convertedValue;
    }
}