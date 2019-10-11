// @flow
import React from 'react';
import moment from '../utils/moment/momentResolver';
import elementTypes from '../metaData/DataElement/elementTypes';
import DataElement from '../metaData/DataElement/DataElement';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import stringifyNumber from './common/stringifyNumber';

function convertDateForListDisplay(rawValue: string): string {
    const momentDate = moment(rawValue);
    return convertMomentToDateFormatString(momentDate);
}

function convertDateTimeForListDisplay(rawValue: string): string {
    const momentDate = moment(rawValue);
    const dateString = convertMomentToDateFormatString(momentDate);
    const timeString = momentDate.format('HH:mm');
    return `${dateString} ${timeString}`;
}

type CoordinateClientValue = {
    latitude: number,
    longitude: number,
};

function convertCoordinateForDisplay(clientValue: CoordinateClientValue) {
    return `[ ${clientValue.longitude}, ${clientValue.latitude} ]`;
}

type FileClientValue = {
    name: string,
    url: string,
    value: string,
};

function convertResourceForDisplay(clientValue: FileClientValue) {
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
    [elementTypes.DATE]: convertDateForListDisplay,
    [elementTypes.DATETIME]: convertDateTimeForListDisplay,
    [elementTypes.TRUE_ONLY]: () => 'Yes',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'Yes' : 'No'),
    [elementTypes.COORDINATE]: convertCoordinateForDisplay,
    [elementTypes.AGE]: convertDateForListDisplay,
    [elementTypes.FILE_RESOURCE]: convertResourceForDisplay,
    [elementTypes.IMAGE]: convertResourceForDisplay,
};

export function convertValue(type: $Values<typeof elementTypes>, value: any, dataElement?: ?DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }

    if (dataElement && dataElement.optionSet) {
        return dataElement.optionSet.getOptionText(value);
    }

    // $FlowSuppress
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
