import { pipe as pipeD2 } from 'capture-core-utils';
import { type DataElement, dataElementTypes } from '../metaData';
import { escapeString } from '../utils/escapeString';
import type { SearchOperator } from '../metaDataMemoryStoreBuilders';
import { convertClientToServer, convertFormToClient } from './index';

type FormValues = { [key: string]: any };

const convertString = (formValues: string, dataElement: DataElement, searchOperator: SearchOperator) => {
    const sanitizedString = formValues.trim();
    const convertedString = dataElement.convertValue(
        sanitizedString,
        pipeD2(convertFormToClient, convertClientToServer),
    );
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${escapeString(convertedString)}`;
};

const convertRange = (formValues: FormValues, dataElement: DataElement) => {
    const { from, to } = formValues;
    const convertedFrom = from && dataElement.convertValue(from, pipeD2(convertFormToClient, convertClientToServer));
    const convertedTo = to && dataElement.convertValue(to, pipeD2(convertFormToClient, convertClientToServer));
    if (from || to) {
        return `${dataElement.id}${convertedFrom ? `:ge:${escapeString(String(convertedFrom))}` : ''}${
            convertedTo ? `:le:${escapeString(String(convertedTo))}` : ''
        }`;
    }
    return null;
};

const convertOrgUnit = (formValues: FormValues, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedId = dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer));
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedId}`;
};

const convertAge = (formValues: FormValues, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedAge =
        formValues && dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer));
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedAge}`;
};

const convertBoolean = (formValues: boolean, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedBool = dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer));
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedBool}`;
};

const valueConvertersForType = {
    [dataElementTypes.TEXT]: convertString,
    [dataElementTypes.MULTI_TEXT]: convertString,
    [dataElementTypes.LONG_TEXT]: convertString,
    [dataElementTypes.NUMBER]: convertRange,
    [dataElementTypes.NUMBER_RANGE]: convertRange,
    [dataElementTypes.INTEGER]: convertRange,
    [dataElementTypes.INTEGER_RANGE]: convertRange,
    [dataElementTypes.INTEGER_POSITIVE]: convertRange,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: convertRange,
    [dataElementTypes.INTEGER_NEGATIVE]: convertRange,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: convertRange,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: convertRange,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: convertRange,
    [dataElementTypes.PERCENTAGE]: convertString,
    [dataElementTypes.DATE]: convertRange,
    [dataElementTypes.DATE_RANGE]: convertRange,
    [dataElementTypes.DATETIME]: convertRange,
    [dataElementTypes.DATETIME_RANGE]: convertRange,
    [dataElementTypes.TIME]: convertRange,
    [dataElementTypes.TIME_RANGE]: convertRange,
    [dataElementTypes.TRUE_ONLY]: convertBoolean,
    [dataElementTypes.BOOLEAN]: convertBoolean,
    [dataElementTypes.PHONE_NUMBER]: convertString,
    [dataElementTypes.EMAIL]: convertString,
    [dataElementTypes.ORGANISATION_UNIT]: convertOrgUnit,
    [dataElementTypes.AGE]: convertAge,
    [dataElementTypes.USERNAME]: convertString,
};

export function convertValue(value: FormValues, dataElement: DataElement, searchOperator: SearchOperator) {
    if (value === null || value === undefined) {
        return null;
    }

    return valueConvertersForType[dataElement.type]
        ? valueConvertersForType[dataElement.type](value, dataElement, searchOperator)
        : value;
}
