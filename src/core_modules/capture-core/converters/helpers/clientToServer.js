// @flow
// todo this function is never used :)
import type { RenderFoundation } from '../../metaData';
import { convertValue } from '../clientToServer';

export function convertClientValuesToServer(
  clientValues: ?Object,
  renderFoundation: RenderFoundation,
) {
  const convertedValues = renderFoundation.convertValues(clientValues, convertValue);
  return convertedValues;
}
