// @flow
import { moment } from 'capture-core-utils/moment';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import { dataElementTypes } from '../metaData';

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
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.DATE]: convertDateForEdit,
    [dataElementTypes.DATETIME]: convertDateTimeForEdit,
    [dataElementTypes.TIME]: convertTimeForEdit,
    [dataElementTypes.TRUE_ONLY]: () => 'true',
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [dataElementTypes.AGE]: convertAgeForEdit,
};

export function convertValue(value: any, type: DataElementTypes) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    // $FlowFixMe dataElementTypes flow error
    return (valueConvertersForType[type] ? valueConvertersForType[type](value) : value);
}
