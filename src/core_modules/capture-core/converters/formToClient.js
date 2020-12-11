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

    const {momentTime} = parseTime(editedTime);
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
    const {momentTime} = parseTime(timeValue);
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

// todo report (lgmt)
const valueConvertersForType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE_RANGE]: (value: RangeValue) => convertRange(parseNumber, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: convertDate,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE_RANGE]: (value: RangeValue) => convertRange(convertDate, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: convertDateTime,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME_RANGE]: (value: RangeValue) => convertRange(convertDateTime, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME]: convertTime,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME_RANGE]: (value: RangeValue) => convertRange(convertTime, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.AGE]: convertAge,
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
