import log from 'loglevel';
import { mapTypeToInterfaceFnName, typeKeys } from '../constants';
import type { IConvertInputRulesValue } from '../types/ruleEngine.types';

const errorCreator = (message: string) => (details?: any) => ({
    ...details,
    message,
});

export class ValueProcessor {
    static errorMessages = {
        TYPE_NOT_SUPPORTED: 'value type not supported',
        CONVERTER_NOT_FOUND: 'converter for type is missing',
    };

    converterObject: IConvertInputRulesValue;
    processValue: (value: any, type: typeof typeKeys[keyof typeof typeKeys]) => any = (value, type) => {
        if (!typeKeys[type]) {
            log.warn(ValueProcessor.errorMessages.TYPE_NOT_SUPPORTED);
            return '';
        }
        const convertFnName = mapTypeToInterfaceFnName[type];
        if (!convertFnName) {
            log.warn(errorCreator(ValueProcessor.errorMessages.CONVERTER_NOT_FOUND)({ type }));
            return value;
        }
        const outputConverter = this.converterObject[convertFnName];
        const convertedValue = outputConverter ? outputConverter(value) : value;
        return convertedValue ?? null;
    };

    constructor(converterObject: IConvertInputRulesValue) {
        this.converterObject = converterObject;
        this.processValue = this.processValue.bind(this);
    }
}
