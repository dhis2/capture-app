// @flow
import { dataElementTypes } from '../../../../../../metaData';
import { convertValue as getDateFilter } from './dateConverter';
import {
    filterTypesObject,
    type BooleanFilterData,
    type TrueOnlyFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../WorkingListsBase';

const getTextFilter = (filter): TextFilterData => {
    const value = filter.like;
    return { value };
};

const getNumericFilter = (filter): NumericFilterData => ({
    ge: filter.ge ? Number(filter.ge) : undefined,
    le: filter.le ? Number(filter.le) : undefined,
});

const getBooleanFilter = (filter): BooleanFilterData => ({
    values: filter.in.map(value => value === 'true'),
});

const getTrueOnlyFilter = (/* filter: ApiDataFilterTrueOnly */): TrueOnlyFilterData => ({
    value: true,
});

const getFilterByType = {
    [filterTypesObject.TEXT]: getTextFilter,
    [filterTypesObject.NUMBER]: getNumericFilter,
    [filterTypesObject.INTEGER]: getNumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [filterTypesObject.DATE]: getDateFilter,
    [filterTypesObject.BOOLEAN]: getBooleanFilter,
    [filterTypesObject.TRUE_ONLY]: getTrueOnlyFilter,
};

export function convertToClientConfig(value: any, type: $Keys<typeof dataElementTypes>) {
    // $FlowFixMe dataElementTypes flow error
    return (!value || !getFilterByType[type]) ? value : getFilterByType[type](value);
}
