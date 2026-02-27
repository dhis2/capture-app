import { dataElementTypes } from '../../../../../metaData';

// The forcedSearchOperators take precedence over the preferredSearchOperator
export const forcedSearchOperators: Array<keyof typeof dataElementTypes> = [
    dataElementTypes.MULTI_TEXT,
    dataElementTypes.NUMBER,
    dataElementTypes.NUMBER_RANGE,
    dataElementTypes.INTEGER,
    dataElementTypes.INTEGER_RANGE,
    dataElementTypes.INTEGER_POSITIVE,
    dataElementTypes.INTEGER_POSITIVE_RANGE,
    dataElementTypes.INTEGER_NEGATIVE,
    dataElementTypes.INTEGER_NEGATIVE_RANGE,
    dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE,
    dataElementTypes.DATE,
    dataElementTypes.DATE_RANGE,
    dataElementTypes.DATETIME,
    dataElementTypes.DATETIME_RANGE,
    dataElementTypes.TIME,
    dataElementTypes.TIME_RANGE,
    dataElementTypes.PERCENTAGE,
    dataElementTypes.BOOLEAN,
    dataElementTypes.TRUE_ONLY,
    dataElementTypes.ORGANISATION_UNIT,
    dataElementTypes.AGE,
    dataElementTypes.USERNAME,
];
