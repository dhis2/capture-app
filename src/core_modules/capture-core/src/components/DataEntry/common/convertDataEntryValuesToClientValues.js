// @flow
/* eslint-disable no-new-func */
import { convertValue } from '../../../converters/formToClient';

// $FlowSuppress
const getFunctionFromString = (functionAsString: string) => Function(`return ${functionAsString}`)();

export default function convertDataEntryValuesToClientValues(
    dataEntryValues: Object,
    dataEntryValuesMeta: Object,
    previousData: Object,
) {
    if (!dataEntryValues) {
        return null;
    }

    const eventValues = Object
        .keys(dataEntryValues)
        .reduce((accEventValues, key) => {
            const type = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].type;
            const onConvertOut = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].onConvertOut;

            if (type) {
                const value = dataEntryValues[key];
                accEventValues[key] = convertValue(type, value);
            } else if (onConvertOut) {
                const outId = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].outId;
                const dataEntryValue = dataEntryValues[key];
                const prevEventValue = previousData[outId];
                const onConvertOutFn = getFunctionFromString(onConvertOut);
                accEventValues[outId] = onConvertOutFn(dataEntryValue, prevEventValue);
            } else {
                accEventValues[key] = dataEntryValues[key];
            }
            return accEventValues;
        }, {});

    return eventValues;
}
