// @flow
/* eslint-disable no-new-func */
import { convertValue } from '../../../converters/formToClient';
import getDataEntryKey from './getDataEntryKey';

// $FlowSuppress
const getFunctionFromString = (functionAsString: string) => Function(`return ${functionAsString}`)();

export default function convertDataEntryValuesToEventValues(
    state: ReduxState,
    eventId: string,
    id: string,
    customInputValues?: ?{ [key: string]: any}) {
    const dataEntryKey = getDataEntryKey(id, eventId);
    const dataEntryValues = customInputValues || state.dataEntriesFieldsValue[dataEntryKey];

    if (!dataEntryValues) {
        return null;
    }

    const dataEntryValuesMeta = state.dataEntriesFieldsMeta[dataEntryKey];
    const prevEventMainData = state.events[eventId];
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
                const prevEventValue = prevEventMainData[outId];
                const onConvertOutFn = getFunctionFromString(onConvertOut);
                accEventValues[outId] = onConvertOutFn(dataEntryValue, prevEventValue);
            } else {
                accEventValues[key] = dataEntryValues[key];
            }
            return accEventValues;
        }, {});

    return eventValues;
}
