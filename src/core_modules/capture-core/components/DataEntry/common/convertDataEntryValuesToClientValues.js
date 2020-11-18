// @flow
/* eslint-disable no-new-func */
import { convertValue } from '../../../converters/formToClient';
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';

// $FlowSuppress
// $FlowFixMe[prop-missing] automated comment
const getFunctionFromString = (functionAsString: string) => Function(`return ${functionAsString}`)();

export default function convertDataEntryValuesToClientValues(
    dataEntryValues: Object,
    dataEntryValuesMeta: Object,
    foundation: RenderFoundation,
) {
    if (!dataEntryValues) {
        return null;
    }

    const eventValues = Object
        .keys(dataEntryValues)
        // eslint-disable-next-line complexity
        .reduce((accEventValues, key) => {
            const type = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].type;
            const onConvertOut = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].onConvertOut;
            const clientIgnore = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].clientIgnore;
            if (clientIgnore) {
                return accEventValues;
            }
            if (type) {
                const value = dataEntryValues[key];
                accEventValues[key] = convertValue(value, type);
            } else if (onConvertOut) {
                const clientId = dataEntryValuesMeta[key] && dataEntryValuesMeta[key].clientId;
                const dataEntryValue = dataEntryValues[key];
                const onConvertOutFn = getFunctionFromString(onConvertOut);
                accEventValues[clientId] = onConvertOutFn(dataEntryValue, foundation);
            } else {
                accEventValues[key] = dataEntryValues[key];
            }
            return accEventValues;
        }, {});

    return eventValues;
}
