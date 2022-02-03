// @flow
import moment from 'moment';
import { getOptionSetFilter } from './optionSet';
import {
    filterTypesObject,
    type BooleanFilterData,
    type TrueOnlyFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../WorkingListsBase';
import type {
    ApiDataFilter,
    ApiDataFilterNumeric,
    ApiDataFilterText,
    ApiDataFilterBoolean,
    ApiDataFilterDate,
    ApiDataFilterOptionSet,
    TeiColumnsMetaForDataFetching,
} from '../../../types';
import { DATE_TYPES } from '../../../constants';

const getTextFilter = (filter: ApiDataFilterText): TextFilterData => {
    const value = filter.like;
    return { value };
};

const getNumericFilter = (filter: ApiDataFilterNumeric): NumericFilterData => ({
    ge: filter.ge ? Number(filter.ge) : undefined,
    le: filter.le ? Number(filter.le) : undefined,
});

const getBooleanFilter = (filter: ApiDataFilterBoolean): BooleanFilterData => ({
    values: filter.in.map(value => value === 'true'),
});

const getTrueOnlyFilter = (/* filter: ApiDataFilterTrueOnly */): TrueOnlyFilterData => ({
    value: true,
});

const getDateFilter = ({ dateFilter }: ApiDataFilterDate) => {
    if (dateFilter.type === DATE_TYPES.RELATIVE) {
        return {
            type: dateFilter.type,
            period: dateFilter.period,
        };
    }

    return {
        type: dateFilter.type,
        ge: dateFilter.startDate ? moment(dateFilter.startDate, 'YYYY-MM-DD').toISOString() : undefined,
        le: dateFilter.endDate ? moment(dateFilter.endDate, 'YYYY-MM-DD').toISOString() : undefined,
    };
};

const isOptionSetFilter = (type, filter: ApiDataFilterOptionSet) => {
    if ([filterTypesObject.BOOLEAN].includes(type)) {
        const validBooleanValues = ['true', 'false'];
        return filter.in.some(value => !validBooleanValues.includes[value]);
    }
    return filter.in;
};

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

export const convertDataElementFilters = (filters: Array<ApiDataFilter>, columnsMetaForDataFetching: TeiColumnsMetaForDataFetching): Object =>
    filters.reduce((acc, serverFilter: ApiDataFilter) => {
        const element = columnsMetaForDataFetching.get(serverFilter.attribute);

        // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
        if (!element || !getFilterByType[element.type]) {
            return acc;
        }
        // $FlowFixMe
        const value = isOptionSetFilter(element.type, serverFilter)
            ? // $FlowFixMe
            getOptionSetFilter(serverFilter, element.type)
            : // $FlowFixMe
            getFilterByType[element.type](serverFilter);

        return value ? { ...acc, [serverFilter.attribute]: value } : acc;
    }, {});
