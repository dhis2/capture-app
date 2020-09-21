// @flow
import { dataElementTypes } from '../../../../../metaData';

export const filterTypesObject = {
    [dataElementTypes.TEXT]: dataElementTypes.TEXT,
    [dataElementTypes.NUMBER]: dataElementTypes.NUMBER,
    [dataElementTypes.INTEGER]: dataElementTypes.INTEGER,
    [dataElementTypes.INTEGER_POSITIVE]: dataElementTypes.INTEGER_POSITIVE,
    [dataElementTypes.INTEGER_NEGATIVE]: dataElementTypes.INTEGER_NEGATIVE,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    [dataElementTypes.DATE]: dataElementTypes.DATE,
    [dataElementTypes.BOOLEAN]: dataElementTypes.BOOLEAN,
    [dataElementTypes.TRUE_ONLY]: dataElementTypes.TRUE_ONLY,
    [dataElementTypes.ASSIGNEE]: dataElementTypes.ASSIGNEE,
};

