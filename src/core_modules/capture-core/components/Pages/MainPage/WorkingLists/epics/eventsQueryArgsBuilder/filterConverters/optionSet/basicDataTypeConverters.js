// @flow
import { moment } from 'capture-core-utils/moment';
import { dataElementTypes } from '../../../../../../../../metaData';

const stringifyNumber = (rawValue: number) => rawValue.toString();

function convertDate(isoString: string): string {
    const momentDate = moment(isoString);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
}

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.TRUE_ONLY]: () => 'true',
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.IMAGE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.COORDINATE]: (rawValue: Object) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [dataElementTypes.PERCENTAGE]: (rawValue: Object) => rawValue.replace('%', ''),
    [dataElementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.id,
};

export function convertDataTypeValueToRequest(value: any, type: $Keys<typeof dataElementTypes>) {
    // $FlowFixMe
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
