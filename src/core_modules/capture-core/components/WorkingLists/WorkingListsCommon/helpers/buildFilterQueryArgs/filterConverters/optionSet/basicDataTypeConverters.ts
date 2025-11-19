import moment from 'moment';
import { dataElementTypes } from '../../../../../../../metaData';

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
    [dataElementTypes.FILE_RESOURCE]: (rawValue: any) => rawValue.value,
    [dataElementTypes.IMAGE]: (rawValue: any) => rawValue.value,
    [dataElementTypes.COORDINATE]: (rawValue: any) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [dataElementTypes.PERCENTAGE]: (rawValue: any) => rawValue.replace('%', ''),
    [dataElementTypes.ORGANISATION_UNIT]: (rawValue: any) => rawValue.id,
};

export function convertDataTypeValueToRequest(value: any, type: keyof typeof dataElementTypes) {
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
