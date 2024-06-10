// @flow
import React from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import { Tag } from '@dhis2/ui';
import { PreviewImage } from 'capture-ui';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { dataElementTypes, type DataElement } from '../metaData';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import { stringifyNumber } from './common/stringifyNumber';
import { MinimalCoordinates } from '../components/MinimalCoordinates';

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

type FileClientValue = {
    name: string,
    url: string,
    value: string,
};

type ImageClientValue = {
    ...FileClientValue,
    previewUrl: string,
};

function convertFileForDisplay(clientValue: FileClientValue) {
    // Fallback until https://dhis2.atlassian.net/browse/DHIS2-16994 is implemented
    if (typeof clientValue === 'string' || clientValue instanceof String) {
        return clientValue;
    }
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

function convertImageForDisplay(clientValue: ImageClientValue) {
    // Fallback until https://dhis2.atlassian.net/browse/DHIS2-16994 is implemented
    if (typeof clientValue === 'string' || clientValue instanceof String) {
        return clientValue;
    }
    return featureAvailable(FEATURES.trackerImageEndpoint) ? (
        <PreviewImage
            url={clientValue.url}
            previewUrl={clientValue.previewUrl}
        />
    ) : convertFileForDisplay(clientValue);
}

function convertRangeForDisplay(parser: any, clientValue: any) {
    return (
        <span>
            {parser(clientValue.from)} {'->'} {parser(clientValue.to)}
        </span>
    );
}
function convertNumberRangeForDisplay(clientValue) {
    return (
        <span>
            {clientValue.from} {'->'} {clientValue.to}
        </span>
    );
}

function convertStatusForDisplay(clientValue: Object) {
    const { isNegative, isPositive, text } = clientValue;
    return (
        <Tag negative={isNegative} positive={isPositive}>
            {text}
        </Tag>
    );
}

function convertOrgUnitForDisplay(rawValue: string | Object) {
    return (typeof rawValue === 'string' ? rawValue : rawValue.name);
}

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: value => convertRangeForDisplay(stringifyNumber, value),
    [dataElementTypes.PERCENTAGE]: (value: number) => `${stringifyNumber(value)} %`,
    [dataElementTypes.DATE]: convertDateForListDisplay,
    [dataElementTypes.DATE_RANGE]: value => convertRangeForDisplay(convertDateForListDisplay, value),
    [dataElementTypes.DATETIME]: convertDateTimeForListDisplay,
    [dataElementTypes.DATETIME_RANGE]: value => convertRangeForDisplay(convertDateTimeForListDisplay, value),
    [dataElementTypes.TIME]: convertTimeForListDisplay,
    [dataElementTypes.TIME_RANGE]: value => convertRangeForDisplay(convertTimeForListDisplay, value),
    [dataElementTypes.TRUE_ONLY]: () => i18n.t('Yes'),
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? i18n.t('Yes') : i18n.t('No')),
    [dataElementTypes.COORDINATE]: MinimalCoordinates,
    [dataElementTypes.AGE]: convertDateForListDisplay,
    [dataElementTypes.FILE_RESOURCE]: convertFileForDisplay,
    [dataElementTypes.IMAGE]: convertImageForDisplay,
    [dataElementTypes.ORGANISATION_UNIT]: convertOrgUnitForDisplay,
    [dataElementTypes.ASSIGNEE]: (rawValue: Object) => `${rawValue.name} (${rawValue.username})`,
    [dataElementTypes.NUMBER_RANGE]: convertNumberRangeForDisplay,
    [dataElementTypes.STATUS]: convertStatusForDisplay,
};

export function convertValue(value: any, type: $Keys<typeof dataElementTypes>, dataElement?: ?DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }

    if (dataElement && dataElement.optionSet) {
        if (dataElement.type === dataElementTypes.MULTI_TEXT) {
            return dataElement.optionSet.getMultiOptionsText(value);
        }
        return dataElement.optionSet.getOptionText(value);
    }

    // $FlowFixMe dataElementTypes flow error
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}


// This function will replace the convertValue function in the future (as it should not require a dataElement class to use optionSet)
export function convert(
    value: any,
    type: $Keys<typeof dataElementTypes>,
    options: ?Array<{ code: string, name: string }>,
) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }

    if (options) {
        if (type === dataElementTypes.MULTI_TEXT) {
            return options
                .filter(option => value.includes(option.code))
                .map(option => option.name)
                .join(', ');
        }
        return options
            .find(option => option.code === value)
            ?.name ?? value;
    }

    // $FlowFixMe dataElementTypes flow error
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
