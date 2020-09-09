// @flow
import React from 'react';
import moment from '../utils/moment/momentResolver';
import elementTypes from '../metaData/DataElement/elementTypes';
import DataElement from '../metaData/DataElement/DataElement';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import stringifyNumber from './common/stringifyNumber';
import { MinimalCoordinates } from "../../components/MinimalCoordinates";

function convertDateForView(rawValue: string): string {
    const momentDate = moment(rawValue);
    return convertMomentToDateFormatString(momentDate);
}

function convertDateTimeForView(rawValue: string): string {
    const momentDate = moment(rawValue);
    const dateString = convertMomentToDateFormatString(momentDate);
    const timeString = momentDate.format('HH:mm');
    return `${dateString} ${timeString}`;
}

function convertTimeForView(rawValue: string): string {
    const momentDate = moment(rawValue, 'HH:mm', true);
    return momentDate.format('HH:mm');
}

type FileClientValue = {
    name: string,
    url: string,
    value: string,
};

function convertResourceForView(clientValue: FileClientValue) {
    return (
        <a
            href={clientValue.url}
            target="_blank"
            onClick={(event) => { event.stopPropagation(); }}
        >
            {clientValue.name}
        </a>
    );
}

const valueConvertersForType = {
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.DATE]: convertDateForView,
    [elementTypes.DATETIME]: convertDateTimeForView,
    [elementTypes.TIME]: convertTimeForView,
    [elementTypes.TRUE_ONLY]: () => 'Yes',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'Yes' : 'No'),
    [elementTypes.COORDINATE]: MinimalCoordinates,
    [elementTypes.AGE]: convertDateForView,
    [elementTypes.FILE_RESOURCE]: convertResourceForView,
    [elementTypes.IMAGE]: convertResourceForView,
    [elementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.name,
};

export function convertValue(value: any, type: $Values<typeof elementTypes>, dataElement?: ?DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }

    if (dataElement && dataElement.optionSet) {
        return dataElement.optionSet.getOptionText(value);
    }

    // $FlowSuppress
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
