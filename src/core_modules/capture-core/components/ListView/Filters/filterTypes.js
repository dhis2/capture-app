// @flow
import { dataElementTypes } from '../../../metaData';

export const filterTypesArray = [
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.TEXT,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.NUMBER,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.INTEGER,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.INTEGER_POSITIVE,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.INTEGER_NEGATIVE,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.DATE,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.BOOLEAN,
    // $FlowFixMe[prop-missing] automated comment
    dataElementTypes.TRUE_ONLY,
    'ASSIGNEE',
];

export const filterTypesObject = filterTypesArray.reduce((accFilterTypesObject, type) => {
    accFilterTypesObject[type] = type;
    return accFilterTypesObject;
}, {});
