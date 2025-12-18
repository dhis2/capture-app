import { dataElementTypes } from '../../../../../metaData';
import { searchOperators } from './searchOperator.const';

export const defaultSearchOperators = {
    [dataElementTypes.TEXT]: [searchOperators.LIKE, searchOperators.SW, searchOperators.EQ],
    [dataElementTypes.LONG_TEXT]: [searchOperators.LIKE, searchOperators.SW, searchOperators.EQ],
    [dataElementTypes.EMAIL]: [searchOperators.LIKE, searchOperators.SW, searchOperators.EQ],
    [dataElementTypes.PHONE_NUMBER]: [searchOperators.LIKE, searchOperators.SW, searchOperators.EQ],
    [dataElementTypes.PERCENTAGE]: [searchOperators.LIKE, searchOperators.SW, searchOperators.EQ],
    [dataElementTypes.ORGANISATION_UNIT]: [searchOperators.LIKE, searchOperators.SW, searchOperators.EQ],
    [dataElementTypes.USERNAME]: [searchOperators.LIKE, searchOperators.SW, searchOperators.EQ],
};
