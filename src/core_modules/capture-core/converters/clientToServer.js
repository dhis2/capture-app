// @flow
import { moment } from 'capture-core-utils/moment';
import elementTypes from '../metaData/DataElement/elementTypes';

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
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    [elementTypes.DATE]: convertDate,
    [elementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    [elementTypes.TRUE_ONLY]: () => 'true',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [elementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
    [elementTypes.IMAGE]: (rawValue: Object) => rawValue.value,
    [elementTypes.COORDINATE]: (rawValue: Object) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [elementTypes.PERCENTAGE]: (rawValue: Object) => rawValue.replace('%', ''),
    [elementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.id,
};

export function convertValue(value: any, type: $Values<typeof elementTypes>) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return (valueConvertersForType[type] ?
        // $FlowFixMe
        valueConvertersForType[type](value) :
        value);
}
