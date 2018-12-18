// @flow
import isString from 'd2-utilizr/lib/isString';

import elementTypes from '../metaData/DataElement/elementTypes';
import parseNumber from '../utils/parsers/number.parser';
import parseDate from '../utils/parsers/date.parser';

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

    let hour;
    let minutes;
    if (/[:.]/.test(editedTime)) {
        [hour, minutes] = editedTime.split(/[:.]/);
    } else if (editedTime.length === 3) {
        hour = editedTime.substring(0, 1);
        minutes = editedTime.substring(2, 3);
    } else {
        hour = editedTime.substring(0, 2);
        minutes = editedTime.substring(3, 4);
    }

    const momentDateTime = parseDate(editedDate).momentDate;
    momentDateTime.hour(hour);
    momentDateTime.minute(minutes);
    return momentDateTime.toISOString();
}

function convertDate(dateValue: string) {
    return parseDate(dateValue).momentDate.toISOString();
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
    // $FlowSuppress
    [elementTypes.DATE]: convertDate,
    [elementTypes.DATETIME]: convertDateTime,
    [elementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [elementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    [elementTypes.AGE]: convertAge,
};

export function convertValue(type: $Values<typeof elementTypes>, value: any) {
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
