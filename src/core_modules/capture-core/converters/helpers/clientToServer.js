// @flow
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import { convertValue } from '../clientToServer';

export function convertClientValuesToServer(
  clientValues: ?Object,
  renderFoundation: RenderFoundation,
) {
  const convertedValues = renderFoundation.convertValues(clientValues, convertValue);
  return convertedValues;
}
