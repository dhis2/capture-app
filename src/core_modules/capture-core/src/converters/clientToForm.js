// @flow
import moment from '../utils/moment/momentResolver';
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
    const date = moment(rawValue);
    const dateString = date.format('L');
    return dateString;
}

function convertDateTimeForEdit(rawValue: string): DateTimeFormValue {
    const dateTime = moment(rawValue);
    const dateString = dateTime.format('L');
    const timeString = dateTime.format('LT');
    return {
        date: dateString,
        time: timeString,
    };
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
        // $FlowSuppress
        date: moment(rawValue).format('L'),
        years: years.toString(),
        months: months.toString(),
        days: days.toString(),
    };
}

const valueConvertersForType = {
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.DATE]: convertDateForEdit,
    [elementTypes.DATETIME]: convertDateTimeForEdit,
    [elementTypes.TRUE_ONLY]: () => 'true',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [elementTypes.AGE]: convertAgeForEdit,
};

export function convertValue(type: $Values<typeof elementTypes>, value: any) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
