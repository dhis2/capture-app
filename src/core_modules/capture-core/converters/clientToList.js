// @flow
import React from 'react';
import { moment } from 'capture-core-utils/moment';
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

function convertTimeForListDisplay(rawValue: string): string {
    const momentDate = moment(rawValue, 'HH:mm', true);
    return momentDate.format('HH:mm');
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
            rel="noopener noreferrer"
            onClick={(event) => { event.stopPropagation(); }}
        >
            {clientValue.name}
        </a>
    );
}

function convertRangeForDisplay(parser: any, clientValue: any) {
    return (
        <span>
            {parser(clientValue.from)} {'->'} {parser(clientValue.to)}
        </span>
    );
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
    [elementTypes.DATE]: convertDateForListDisplay,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE_RANGE]: value => convertRangeForDisplay(convertDateForListDisplay, value),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: convertDateTimeForListDisplay,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME]: convertTimeForListDisplay,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: () => 'Yes',
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'Yes' : 'No'),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.COORDINATE]: convertCoordinateForDisplay,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.AGE]: convertDateForListDisplay,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.FILE_RESOURCE]: convertResourceForDisplay,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.IMAGE]: convertResourceForDisplay,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.name,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.ASSIGNEE]: (rawValue: Object) => `${rawValue.name} (${rawValue.username})`,
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
