// @flow
import isString from 'd2-utilizr/lib/isString';
import { parseNumber, parseTime } from 'capture-core-utils/parsers';
import { dataElementTypes } from '../metaData';
import { parseDate } from '../utils/converters/date';

type DateTimeValue = {
    date: string,
    time: string,
};

type RangeValue = {
    from: string,
    to: string,
}

function convertDateTime(formValue: DateTimeValue): string {
    const editedDate = formValue.date;
    const editedTime = formValue.time;

    const momentTime = parseTime(editedTime).momentTime;
    const hours = momentTime.hour();
    const minutes = momentTime.minute();

    // $FlowFixMe[incompatible-type] automated comment
    const momentDateTime: moment$Moment = parseDate(editedDate).momentDate;
    momentDateTime.hour(hours);
    momentDateTime.minute(minutes);
    return momentDateTime.toISOString();
}

function convertDate(dateValue: string) {
    // $FlowFixMe[incompatible-use] automated comment
    return parseDate(dateValue).momentDate.toISOString();
}

function convertTime(timeValue: string) {
    const momentTime = parseTime(timeValue).momentTime;
    momentTime.locale('en');
    return momentTime.format('HH:mm');
}

function convertAge(ageValue: Object) {
    return convertDate(ageValue.date);
}

function convertRange(parser: Function, value: RangeValue) {
    return {
        from: parser(value.from),
        to: parser(value.to),
    };
}

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: parseNumber,
    [dataElementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER]: parseNumber,
    [dataElementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    [dataElementTypes.DATETIME]: convertDateTime,
    [dataElementTypes.DATETIME_RANGE]: (value: RangeValue) => convertRange(convertDateTime, value),
    [dataElementTypes.TIME]: convertTime,
    [dataElementTypes.TIME_RANGE]: (value: RangeValue) => convertRange(convertTime, value),
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    [dataElementTypes.AGE]: convertAge,
};

export function convertValue(value: any, type: $Values<typeof dataElementTypes>) {
    if (value == null) {
        return null;
    }

    let toConvertValue;
    if (isString(value)) {
        toConvertValue = value.trim();
        if (!toConvertValue) {
            return null;
        }
    } else {
        toConvertValue = value;
    }

    // $FlowFixMe[prop-missing] automated comment
    return valueConvertersForType[type] ? valueConvertersForType[type](toConvertValue) : toConvertValue;
}
