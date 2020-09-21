// @flow
import { moment } from 'capture-core-utils/moment';
import { dataElementTypes } from '../metaData';

import stringifyNumber from './common/stringifyNumber';

type RangeValue = {
    from: any,
    to: any,
}


function convertDate(rawValue: string): string {
    const editedDate = rawValue;
    const momentDate = moment(editedDate);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
}

function convertRange(parser: (value: any) => any, rangeValue: RangeValue) {
    return {
        from: parser(rangeValue.from),
        to: parser(rangeValue.to),
    };
}

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    [dataElementTypes.TRUE_ONLY]: () => 'true',
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.IMAGE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.COORDINATE]: (rawValue: Object) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [dataElementTypes.PERCENTAGE]: (rawValue: Object) => rawValue.replace('%', ''),
    [dataElementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.id,
};

export function convertValue(value: any, type: DataElementTypes) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    // $FlowFixMe dataElementTypes flow error
    return (valueConvertersForType[type] ? valueConvertersForType[type](value) : value);
}
