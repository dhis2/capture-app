// @flow
import { moment } from 'capture-core-utils/moment';
import { dataElementTypes as elementTypes } from '../../../../../../../../metaData';

const stringifyNumber = (rawValue: number) => rawValue.toString();

function convertDate(isoString: string): string {
  const momentDate = moment(isoString);
  momentDate.locale('en');
  return momentDate.format('YYYY-MM-DD');
}

const valueConvertersForType = {
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.NUMBER]: stringifyNumber,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER]: stringifyNumber,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.DATE]: convertDate,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.TRUE_ONLY]: () => 'true',
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.IMAGE]: (rawValue: Object) => rawValue.value,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.COORDINATE]: (rawValue: Object) => `[${rawValue.longitude},${rawValue.latitude}]`,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.PERCENTAGE]: (rawValue: Object) => rawValue.replace('%', ''),
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.id,
};

export function convertDataTypeValueToRequest(value: any, type: $Values<typeof elementTypes>) {
  return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
