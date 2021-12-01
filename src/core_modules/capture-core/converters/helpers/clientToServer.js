// @flow
// todo this function is never used :)
import { convertValue } from '../clientToServer';
import type { RenderFoundation } from '../../metaData';

export function convertClientValuesToServer(clientValues: ?Object, renderFoundation: RenderFoundation) {
    const convertedValues = renderFoundation.convertValues(clientValues, convertValue);
    return convertedValues;
}
