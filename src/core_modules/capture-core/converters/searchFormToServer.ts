import { pipe as pipeD2 } from 'capture-core-utils';
import { type DataElement, dataElementTypes } from '../metaData';
import { escapeString } from '../utils/escapeString';
import type { SearchOperator } from '../metaDataMemoryStoreBuilders';
import { convertClientToServer, convertFormToClient } from './index';

type FormValues = { [key: string]: any };

const convertValuePipe = pipeD2(convertFormToClient, convertClientToServer);

const convertString = (formValue: string, dataElement: DataElement, searchOperator: SearchOperator) => {
    const sanitizedString = formValue.trim();
    const convertedString = dataElement.convertValue(sanitizedString, convertValuePipe);
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${escapeString(convertedString)}`;
};

const convertRange = (formValues: FormValues, dataElement: DataElement) => {
    const { from, to } = formValues;
    if (!from && !to) {
        return null;
    }

    const convertedFrom = from && dataElement.convertValue(from, convertValuePipe);
    const convertedTo = to && dataElement.convertValue(to, convertValuePipe);

    const fromPart = convertedFrom ? `:ge:${escapeString(String(convertedFrom))}` : '';
    const toPart = convertedTo ? `:le:${escapeString(String(convertedTo))}` : '';

    return `${dataElement.id}${fromPart}${toPart}`;
};

const convertOrgUnit = (formValues: FormValues, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedId = dataElement.convertValue(formValues, convertValuePipe);
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedId}`;
};

const convertAge = (formValues: FormValues, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedAge = formValues && dataElement.convertValue(formValues, convertValuePipe);
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedAge}`;
};

const convertBoolean = (formValue: boolean, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedBool = dataElement.convertValue(formValue, convertValuePipe);
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
