import { dataElementTypes } from '../../../../../metaData';
import { searchOperators } from './searchOperator.const';
import type { SearchOperator } from './searchOperator.const';

// The forcedSearchOperators take precedence over the preferredSearchOperator
export const forcedSearchOperators: Partial<Record<string, SearchOperator>> = {
    [dataElementTypes.NUMBER]: searchOperators.RANGE,
    [dataElementTypes.NUMBER_RANGE]: searchOperators.RANGE,
    [dataElementTypes.INTEGER]: searchOperators.RANGE,
    [dataElementTypes.INTEGER_RANGE]: searchOperators.RANGE,
    [dataElementTypes.INTEGER_POSITIVE]: searchOperators.RANGE,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: searchOperators.RANGE,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: searchOperators.RANGE,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: searchOperators.RANGE,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: searchOperators.RANGE,
    [dataElementTypes.DATE]: searchOperators.RANGE,
    [dataElementTypes.DATE_RANGE]: searchOperators.RANGE,
    [dataElementTypes.DATETIME]: searchOperators.RANGE,
    [dataElementTypes.DATETIME_RANGE]: searchOperators.RANGE,
    [dataElementTypes.TIME]: searchOperators.RANGE,
    [dataElementTypes.TIME_RANGE]: searchOperators.RANGE,
    [dataElementTypes.BOOLEAN]: searchOperators.EQ,
    [dataElementTypes.TRUE_ONLY]: searchOperators.EQ,
    [dataElementTypes.AGE]: searchOperators.EQ,
};
