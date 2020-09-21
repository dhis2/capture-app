// @flow
import elementTypes from '../../../../../metaData/DataElement/elementTypes';

export const filterTypesObject = {
    [elementTypes.TEXT]: elementTypes.TEXT,
    [elementTypes.NUMBER]: elementTypes.NUMBER,
    [elementTypes.INTEGER]: elementTypes.INTEGER,
    [elementTypes.INTEGER_POSITIVE]: elementTypes.INTEGER_POSITIVE,
    [elementTypes.INTEGER_NEGATIVE]: elementTypes.INTEGER_NEGATIVE,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: elementTypes.INTEGER_ZERO_OR_POSITIVE,
    [elementTypes.DATE]: elementTypes.DATE,
    [elementTypes.BOOLEAN]: elementTypes.BOOLEAN,
    [elementTypes.TRUE_ONLY]: elementTypes.TRUE_ONLY,
    [elementTypes.ASSIGNEE]: elementTypes.ASSIGNEE,
};

