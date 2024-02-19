// @flow
import { convertValue } from '../../../converters/formToClient';
import type { RenderFoundation } from '../../../metaData';

// $FlowFixMe[prop-missing] automated comment
const getFunctionFromString = (functionAsString: string) => Function(`return ${functionAsString}`)();

export function convertDataEntryValuesToClientValues(
    dataEntryValues: ?Object,
    dataEntryValuesMeta: Object,
    foundation: RenderFoundation,
) {
    if (!dataEntryValues) {
        return undefined;
    }
    const eventValues = Object
        .keys(dataEntryValues)
        .reduce((accEventValues, key) => {
            const {
                type,
                onConvertOut,
                clientIgnore,
                featureType: customFeatureType,
            } = dataEntryValuesMeta[key] || {};
            if (clientIgnore) {
                return accEventValues;
            }
            if (type) {
                const value = dataEntryValues[key];
                accEventValues[key] = convertValue(value, type);
            } else if (onConvertOut) {
                const clientId = dataEntryValuesMeta[key].clientId;
                const dataEntryValue = dataEntryValues[key];
                const onConvertOutFn = getFunctionFromString(onConvertOut);
                accEventValues[clientId] = onConvertOutFn(dataEntryValue, foundation, customFeatureType);
            } else {
                accEventValues[key] = dataEntryValues[key];
            }
            return accEventValues;
        }, {});

    return eventValues;
}
