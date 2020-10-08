// @flow
import { moment } from 'capture-core-utils/moment';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import elementTypes from '../metaData/DataElement/elementTypes';

import stringifyNumber from './common/stringifyNumber';

type DateTimeFormValue = {
    date: string,
    time: string
};

type AgeFormValue = {
    date?: ?string,
    years?: ?string,
    months?: ?string,
    days?: ?string,
}

function convertDateForEdit(rawValue: string): string {
    const momentInstance = moment(rawValue);
    return convertMomentToDateFormatString(momentInstance);
}

function convertDateTimeForEdit(rawValue: string): DateTimeFormValue {
    const dateTime = moment(rawValue);
    const dateString = convertMomentToDateFormatString(dateTime);
    const timeString = dateTime.format('HH:mm');
    return {
        date: dateString,
        time: timeString,
    };
}

function convertTimeForEdit(rawValue: string) {
    const momentTime = moment(rawValue, 'HH:mm', true);
    return momentTime.format('HH:mm');
}

function convertAgeForEdit(rawValue: string): AgeFormValue {
    const now = moment();
    const age = moment(rawValue);

    const years = now.diff(age, 'years');
    age.add(years, 'years');

    const months = now.diff(age, 'months');
    age.add(months, 'months');

    const days = now.diff(age, 'days');

    return {
        date: convertMomentToDateFormatString(moment(rawValue)),
        years: years.toString(),
        months: months.toString(),
        days: days.toString(),
    };
}

const valueConvertersForType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: convertDateForEdit,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: convertDateTimeForEdit,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME]: convertTimeForEdit,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: () => 'true',
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.AGE]: convertAgeForEdit,
};

export function convertValue(value: any, type: $Values<typeof elementTypes>) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return (valueConvertersForType[type] ?
        valueConvertersForType[type](value) :
        value);
}
