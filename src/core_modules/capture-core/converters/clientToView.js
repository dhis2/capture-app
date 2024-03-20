// @flow
import React from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import { PreviewImage } from 'capture-ui';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { dataElementTypes, type DataElement } from '../metaData';
import { convertMomentToDateFormatString } from '../utils/converters/date';
import { stringifyNumber } from './common/stringifyNumber';
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

type ImageClientValue = {
    ...FileClientValue,
    previewUrl: string,
};

function convertFileForDisplay(clientValue: FileClientValue) {
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
    return featureAvailable(FEATURES.trackerImageEndpoint) ? (
        <PreviewImage
            url={clientValue.url}
            previewUrl={clientValue.previewUrl}
            alignLeft
        />
    ) : convertFileForDisplay(clientValue);
}


const valueConvertersForType = {
    [dataElementTypes.NUMBER]: stringifyNumber,
    [dataElementTypes.INTEGER]: stringifyNumber,
    [dataElementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [dataElementTypes.PERCENTAGE]: (value: number) => `${stringifyNumber(value)} %`,
    [dataElementTypes.DATE]: convertDateForView,
    [dataElementTypes.DATETIME]: convertDateTimeForView,
    [dataElementTypes.TIME]: convertTimeForView,
    [dataElementTypes.TRUE_ONLY]: () => i18n.t('Yes'),
    [dataElementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? i18n.t('Yes') : i18n.t('No')),
    [dataElementTypes.COORDINATE]: MinimalCoordinates,
    [dataElementTypes.AGE]: convertDateForView,
    [dataElementTypes.FILE_RESOURCE]: convertFileForDisplay,
    [dataElementTypes.IMAGE]: convertImageForDisplay,
    [dataElementTypes.ORGANISATION_UNIT]: (rawValue: Object) => rawValue.name,
    [dataElementTypes.POLYGON]: () => 'Polygon',
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

export function convertDateWithTimeForView(rawValue?: ?string): string {
    if (!rawValue) { return ''; }
    if (!moment(rawValue).hours() && !moment(rawValue).minutes()) {
        return convertDateForView(rawValue);
    }
    return convertDateTimeForView(rawValue);
}
