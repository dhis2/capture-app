// @flow
import elementTypes from '../../../../../metaData/DataElement/elementTypes';

export const filterTypesArray = [
    elementTypes.TEXT,
    elementTypes.INTEGER,
    elementTypes.INTEGER_POSITIVE,
    elementTypes.INTEGER_NEGATIVE,
    elementTypes.INTEGER_ZERO_OR_POSITIVE,
];

export const filterTypesObject = filterTypesArray.reduce((accFilterTypesObject, type) => {
    accFilterTypesObject[type] = type;
    return accFilterTypesObject;
}, {});

