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

// todo report (lgmt)
const valueConvertersForType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(stringifyNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: convertDate,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
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

export function convertValue(value: any, type: $Values<typeof elementTypes>) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return (valueConvertersForType[type] ?
        valueConvertersForType[type](value) :
        value);
}
