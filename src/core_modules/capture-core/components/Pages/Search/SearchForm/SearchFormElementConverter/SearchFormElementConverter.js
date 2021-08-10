// @flow
import { type DataElement } from '../../../../../metaData';

type FormValues = { [key: string]: any}

const derivedFilterKeyword = (dataElement) => {
    const hasOptionSet = !!dataElement.optionSet;
    return hasOptionSet ? 'eq' : 'like';
};

const convertString = (formValues: string, dataElement: DataElement) => {
    const convertedString = formValues.replace(/\s/g, '');
    return `${dataElement.id}:${derivedFilterKeyword(dataElement)}:${convertedString}`;
};

const convertRange = (formValues: FormValues, dataElement: DataElement) => {
    const { from, to } = formValues;
    if (from && to) {
        return `${dataElement.id}:ge:${from}:le:${to}`;
    }
    return null;
};

const convertOrgUnit = (formValues: FormValues, dataElement: DataElement) => {
    const { id } = formValues;
    return `${dataElement.id}:${derivedFilterKeyword(dataElement)}:${id}`;
};

const convertAge = (formValues: FormValues, dataElement: DataElement) => {
    const { date } = formValues;
    return `${dataElement.id}:eq:${date}`;
};

const convertFile = (formValues: FormValues, dataElement: DataElement) => {
    const { name } = formValues;
    return `${dataElement.id}:${derivedFilterKeyword(dataElement)}:${name}`;
};

const convertBoolean = (formValues: string, dataElement: DataElement) => `${dataElement.id}:eq:${formValues}`;

const unsupportedType = (formValues: FormValues, dataElement: DataElement) => `${dataElement.id}`;

export const dataElementConvertFunctions = Object.freeze({
    TEXT: convertString,
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
    USERNAME: convertString,
    ASSIGNEE: convertString,
    UNKNOWN: unsupportedType,
});
