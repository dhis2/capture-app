import { dataElementTypes } from '../../../metaData';

export const MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS = 25;

export const filterTypesObject = {
    TEXT: dataElementTypes.TEXT,
    NUMBER: dataElementTypes.NUMBER,
    INTEGER: dataElementTypes.INTEGER,
    INTEGER_POSITIVE: dataElementTypes.INTEGER_POSITIVE,
    INTEGER_NEGATIVE: dataElementTypes.INTEGER_NEGATIVE,
    INTEGER_ZERO_OR_POSITIVE: dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    DATE: dataElementTypes.DATE,
    BOOLEAN: dataElementTypes.BOOLEAN,
    TRUE_ONLY: dataElementTypes.TRUE_ONLY,
    ASSIGNEE: dataElementTypes.ASSIGNEE,
} as const;
