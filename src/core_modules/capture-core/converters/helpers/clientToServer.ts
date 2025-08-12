// todo this function is never used :)
import type { RenderFoundation } from '../../metaData';
import { convertValue } from '../clientToServer';

export function convertClientValuesToServer(clientValues: any | null, renderFoundation: RenderFoundation) {
    const convertedValues = renderFoundation.convertValues(clientValues, convertValue);
    return convertedValues;
}
