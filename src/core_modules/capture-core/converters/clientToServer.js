// @flow
import moment from 'moment';
import { dataElementTypes } from '../metaData';
import { stringifyNumber } from './common/stringifyNumber';

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
    [dataElementTypes.PERCENTAGE]: stringifyNumber,
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    [dataElementTypes.TRUE_ONLY]: () => 'true',
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.IMAGE]: (rawValue: Object) => rawValue.value,
    [dataElementTypes.COORDINATE]: (rawValue: Object) => `[${rawValue.longitude},${rawValue.latitude}]`,
    [dataElementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.id,
    [dataElementTypes.AGE]: (rawValue: Object) => convertDate(rawValue),
};

export function convertValue(value: any, type: $Keys<typeof dataElementTypes>) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    // $FlowFixMe dataElementTypes flow error
    return (valueConvertersForType[type] ? valueConvertersForType[type](value) : value);
}

export function convertCategoryOptionsToServer(value: Object | string) {
    if (typeof value === 'object') {
        const categoryObject: Object = value;
        return Object.keys(categoryObject).reduce((acc, categoryId) => {
            acc.push(value[categoryId]?.id);
            return acc;
        }, []).join(';');
    }
    return value;
}
