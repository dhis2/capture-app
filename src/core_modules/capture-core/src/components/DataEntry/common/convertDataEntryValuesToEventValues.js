// @flow
import { convertValue } from '../../../converters/formToClient';
import getDataEntryKey from './getDataEntryKey';

export default function convertDataEntryValuesToEventValues(state: ReduxState, eventId: string, id: string) {
    const dataEntryKey = getDataEntryKey(id, eventId);
    const dataEntryValues = state.dataEntriesValues[dataEntryKey];
    const dataEntryValuesMeta = state.dataEntriesValuesMeta[dataEntryKey];

    if (!dataEntryValues) {
        return null;
    }

    const eventValues = Object
        .keys(dataEntryValues)
        .reduce((accEventValues, key) => {
            const type = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].type;
            const value = dataEntryValues[key];
            accEventValues[key] = type ? convertValue(type, value) : value;
            return accEventValues;
        }, {});

    return eventValues;
}
