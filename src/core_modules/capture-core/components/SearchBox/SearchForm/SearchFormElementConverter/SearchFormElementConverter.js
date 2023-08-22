// @flow
import { pipe as pipeD2 } from '../../../../../capture-core-utils';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import { type DataElement, dataElementTypes } from '../../../../metaData';
import { escapeString } from '../../../../utils/escapeString';

type FormValues = { [key: string]: any}

const derivedFilterKeyword = (dataElement) => {
    const hasOptionSet = dataElement.optionSet && dataElement.type !== dataElementTypes.MULTI_TEXT;
    return hasOptionSet ? 'eq' : 'like';
};

const convertString = (formValues: string, dataElement: DataElement) => {
    const sanitizedString = formValues.trim();
    const convertedString = (dataElement.convertValue(sanitizedString, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:${derivedFilterKeyword(dataElement)}:${escapeString(convertedString)}`;
};

const convertRange = (formValues: FormValues, dataElement: DataElement) => {
    const { from, to } = formValues;
    const convertedFrom = from && (dataElement.convertValue(from, pipeD2(convertFormToClient, convertClientToServer)));
    const convertedTo = to && (dataElement.convertValue(to, pipeD2(convertFormToClient, convertClientToServer)));
    if (from || to) {
        return `${dataElement.id}${convertedFrom ? (`:ge:${convertedFrom}`) : ''}${convertedTo ? (`:le:${convertedTo}`) : ''}`;
    }
    return null;
};

const convertOrgUnit = (formValues: FormValues, dataElement: DataElement) => {
    const convertedId = (dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:${derivedFilterKeyword(dataElement)}:${convertedId}`;
};

const convertAge = (formValues: FormValues, dataElement: DataElement) => {
    const convertedAge = formValues && (dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:eq:${convertedAge}`;
};

const convertFile = (formValues: FormValues, dataElement: DataElement) => {
    const convertedFileName = (dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:${derivedFilterKeyword(dataElement)}:${escapeString(convertedFileName)}`;
};

const convertBoolean = (formValues: boolean, dataElement: DataElement) => {
    const convertedBool = (dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:eq:${convertedBool}`;
};

const unsupportedType = () => null;

export const dataElementConvertFunctions = {
    TEXT: convertString,
    MULTI_TEXT: convertString,
    LONG_TEXT: convertString,
    NUMBER: convertRange,
    NUMBER_RANGE: convertRange,
    INTEGER: convertRange,
    INTEGER_RANGE: convertRange,
    INTEGER_POSITIVE: convertRange,
    INTEGER_POSITIVE_RANGE: convertRange,
    INTEGER_NEGATIVE: convertRange,
    INTEGER_NEGATIVE_RANGE: convertRange,
    INTEGER_ZERO_OR_POSITIVE: convertRange,
    INTEGER_ZERO_OR_POSITIVE_RANGE: convertRange,
    PERCENTAGE: convertString,
    DATE: convertRange,
    DATE_RANGE: convertRange,
    DATETIME: convertRange,
    DATETIME_RANGE: unsupportedType,
    TIME: convertRange,
    TIME_RANGE: convertRange,
    TRUE_ONLY: convertBoolean,
    BOOLEAN: convertBoolean,
    PHONE_NUMBER: convertString,
    EMAIL: convertString,
    FILE_RESOURCE: convertFile,
    URL: convertString,
    ORGANISATION_UNIT: convertOrgUnit,
    IMAGE: convertFile,
    AGE: convertAge,
    COORDINATE: unsupportedType,
    POLYGON: unsupportedType,
    STATUS: unsupportedType,
    USERNAME: convertString,
    ASSIGNEE: convertString,
    UNKNOWN: unsupportedType,
};
