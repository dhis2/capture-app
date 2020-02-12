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
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.DATE]: convertDate,
    [elementTypes.TRUE_ONLY]: () => 'true',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [elementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
    [elementTypes.IMAGE]: (rawValue: Object) => rawValue.value,
    [elementTypes.COORDINATE]: (rawValue: Object) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [elementTypes.PERCENTAGE]: (rawValue: Object) => rawValue.replace('%', ''),
    [elementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.id,
};

export function convertDataTypeValueToRequest(value: any, type: $Values<typeof elementTypes>) {
    // $FlowSuppress
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
