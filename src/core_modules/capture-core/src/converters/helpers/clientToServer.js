// @flow
import Stage from '../../metaData/Stage/Stage';
import { valueConvertersForType } from '../clientToServer';

export function convertClientValuesToServer(clientValues: ?Object, stage: Stage) {
    const convertedValues = stage.convertValues(clientValues, valueConvertersForType);
    return convertedValues;
}
