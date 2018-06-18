// @flow
import elementTypes from '../../../../../metaData/DataElement/elementTypes';

export const filterTypesArray = [
    elementTypes.TEXT,
];

export const filterTypesObject = filterTypesArray.reduce((accFilterTypesObject, type) => {
    accFilterTypesObject[type] = type;
    return accFilterTypesObject;
}, {});

