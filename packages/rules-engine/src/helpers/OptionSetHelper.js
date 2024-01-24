// @flow
import { typeKeys } from '../constants';
import type { Option } from '../services/VariableService';

export class OptionSetHelper {
    static getName(options: Array<Option>, key: any, dataElementValueType: string) {
        if (options) {
            if (dataElementValueType === typeKeys.MULTI_TEXT) {
                const values = key.split(',');
                const optionsName = options.reduce(
                    (acc, option) => (values.includes(option.code) ? acc.concat(option.displayName) : acc),
                    [],
                );
                return optionsName.length !== 0 ? optionsName.join(',') : key;
            }

            const option = options.find(o => o.code === key);
            return (option && option.displayName) || key;
        }
        return key;
    }
}
