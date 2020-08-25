// @flow
import elementTypes from '../../../../metaData/DataElement/elementTypes';

export const selectorTypesArray = [
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.TEXT,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.NUMBER,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.INTEGER,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.INTEGER_POSITIVE,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.INTEGER_NEGATIVE,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.INTEGER_ZERO_OR_POSITIVE,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.DATE,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.BOOLEAN,
    // $FlowFixMe[prop-missing] automated comment
    elementTypes.TRUE_ONLY,
    'ASSIGNEE',
];

export const selectorTypesObject = selectorTypesArray.reduce((accFilterTypesObject, type) => {
    accFilterTypesObject[type] = type;
    return accFilterTypesObject;
}, {});

