import { dataElementTypes } from '../../../metaData';

export const MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS = 25;

export const filterTypesObject = {
    AGE: dataElementTypes.AGE,
    ASSIGNEE: dataElementTypes.ASSIGNEE,
    BOOLEAN: dataElementTypes.BOOLEAN,
    COORDINATE: dataElementTypes.COORDINATE,
    DATE: dataElementTypes.DATE,
    DATETIME: dataElementTypes.DATETIME,
    EMAIL: dataElementTypes.EMAIL,
    FILE_RESOURCE: dataElementTypes.FILE_RESOURCE,
    IMAGE: dataElementTypes.IMAGE,
    INTEGER: dataElementTypes.INTEGER,
    INTEGER_NEGATIVE: dataElementTypes.INTEGER_NEGATIVE,
    INTEGER_POSITIVE: dataElementTypes.INTEGER_POSITIVE,
    INTEGER_ZERO_OR_POSITIVE: dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    LONG_TEXT: dataElementTypes.LONG_TEXT,
    NUMBER: dataElementTypes.NUMBER,
    ORGANISATION_UNIT: dataElementTypes.ORGANISATION_UNIT,
    PERCENTAGE: dataElementTypes.PERCENTAGE,
    PHONE_NUMBER: dataElementTypes.PHONE_NUMBER,
    TEXT: dataElementTypes.TEXT,
    TIME: dataElementTypes.TIME,
    TRUE_ONLY: dataElementTypes.TRUE_ONLY,
    URL: dataElementTypes.URL,
    USERNAME: dataElementTypes.USERNAME,
} as const;
