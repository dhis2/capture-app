// @flow
import isString from 'd2-utilizr/lib/isString';
import { parseNumber, parseTime } from '../utils/parsers';
import { parseDate } from '../utils/converters/date';
import elementTypes from '../metaData/DataElement/elementTypes';

type DateTimeValue = {
    date: string,
    time: string,
};

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

const valueConvertersForType = {
    [elementTypes.NUMBER]: parseNumber,
    [elementTypes.INTEGER]: parseNumber,
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    [elementTypes.DATE]: convertDate,
    [elementTypes.DATETIME]: convertDateTime,
    [elementTypes.TIME]: convertTime,
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
