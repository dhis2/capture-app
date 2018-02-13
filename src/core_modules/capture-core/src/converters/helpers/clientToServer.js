// @flow
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { valueConvertersForType } from '../clientToServer';

export function convertClientValuesToServer(clientValues: ?Object, renderFoundation: RenderFoundation) {
    const convertedValues = renderFoundation.convertValues(clientValues, valueConvertersForType);
    return convertedValues;
}
