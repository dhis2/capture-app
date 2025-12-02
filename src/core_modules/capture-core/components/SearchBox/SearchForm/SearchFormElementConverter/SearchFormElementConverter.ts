import { pipe as pipeD2 } from '../../../../../capture-core-utils';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import type { DataElement } from '../../../../metaData';
import { escapeString } from '../../../../utils/escapeString';
import type { SearchOperator } from '../../../../metaDataMemoryStoreBuilders';

type FormValues = { [key: string]: any };

const convertString = (formValues: string, dataElement: DataElement, searchOperator: SearchOperator) => {
    const sanitizedString = formValues.trim();
    const convertedString = (dataElement.convertValue(sanitizedString, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${escapeString(convertedString)}`;
};

const convertRange = (formValues: FormValues, dataElement: DataElement) => {
    const { from, to } = formValues;
    const convertedFrom = from && (dataElement.convertValue(from, pipeD2(convertFormToClient, convertClientToServer)));
    const convertedTo = to && (dataElement.convertValue(to, pipeD2(convertFormToClient, convertClientToServer)));
    if (from || to) {
        return `${dataElement.id}${convertedFrom ? `:ge:${escapeString(String(convertedFrom))}`
            : ''}${convertedTo ? `:le:${escapeString(String(convertedTo))}` : ''}`;
    }
    return null;
};

const convertOrgUnit = (formValues: FormValues, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedId = (dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedId}`;
};

const convertAge = (formValues: FormValues, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedAge = formValues &&
        (dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedAge}`;
};

const convertBoolean = (formValues: boolean, dataElement: DataElement, searchOperator: SearchOperator) => {
    const convertedBool = (dataElement.convertValue(formValues, pipeD2(convertFormToClient, convertClientToServer)));
    return `${dataElement.id}:${searchOperator.toLowerCase()}:${convertedBool}`;
};

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
    DATETIME_RANGE: convertRange,
    TIME: convertRange,
    TIME_RANGE: convertRange,
    TRUE_ONLY: convertBoolean,
    BOOLEAN: convertBoolean,
    PHONE_NUMBER: convertString,
    EMAIL: convertString,
    ORGANISATION_UNIT: convertOrgUnit,
    AGE: convertAge,
    USERNAME: convertString,
};
