// @flow
import isString from 'd2-utilizr/lib/isString';
import { parseNumber, parseTime } from 'capture-core-utils/parsers';
import elementTypes from '../metaData/DataElement/elementTypes';
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

    // $FlowSuppress: Prechecked
    const momentDateTime: moment$Moment = parseDate(editedDate).momentDate;
    momentDateTime.hour(hours);
    momentDateTime.minute(minutes);
    return momentDateTime.toISOString();
}

function convertDate(dateValue: string) {
    // $FlowSuppress: Prechecked
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
    [elementTypes.NUMBER]: parseNumber,
    [elementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [elementTypes.INTEGER]: parseNumber,
    [elementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    [elementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    [elementTypes.DATE]: convertDate,
    [elementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    [elementTypes.DATETIME]: convertDateTime,
    [elementTypes.DATETIME_RANGE]: (value: RangeValue) => convertRange(convertDateTime, value),
    [elementTypes.TIME]: convertTime,
    [elementTypes.TIME_RANGE]: (value: RangeValue) => convertRange(convertTime, value),
    [elementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [elementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    [elementTypes.AGE]: convertAge,
    [elementTypes.USERNAME]: (user: UserFormValue) => user.username,
};

export function convertValue(value: any, type: $Values<typeof elementTypes>) {
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

    return valueConvertersForType[type] ? valueConvertersForType[type](toConvertValue) : toConvertValue;
}
