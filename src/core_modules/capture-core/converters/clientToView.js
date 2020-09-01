// @flow
import React from 'react';
import { moment } from 'capture-core-utils/moment';
import elementTypes from '../metaData/DataElement/elementTypes';
import DataElement from '../metaData/DataElement/DataElement';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import stringifyNumber from './common/stringifyNumber';
import { MinimalCoordinates } from '../components/MinimalCoordinates';

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
            rel="noopener noreferrer"
            onClick={(event) => { event.stopPropagation(); }}
        >
            {clientValue.name}
        </a>
    );
}

// todo report (lgmt)
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
    [elementTypes.DATE]: convertDateForView,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: convertDateTimeForView,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME]: convertTimeForView,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: () => 'Yes',
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'Yes' : 'No'),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.COORDINATE]: MinimalCoordinates,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.AGE]: convertDateForView,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.FILE_RESOURCE]: convertResourceForView,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.IMAGE]: convertResourceForView,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.name,
};

export function convertValue(value: any, type: $Values<typeof elementTypes>, dataElement?: ?DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }

    if (dataElement && dataElement.optionSet) {
        return dataElement.optionSet.getOptionText(value);
    }


    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
