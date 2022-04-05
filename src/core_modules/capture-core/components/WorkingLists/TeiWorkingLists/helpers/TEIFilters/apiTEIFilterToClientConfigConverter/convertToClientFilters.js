// @flow
import moment from 'moment';
import type { QuerySingleResource } from 'capture-core/utils/api';
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
    ApiDataFilterDateContents,
    ApiDataFilterOptionSet,
    ApiTEIQueryCriteria,
    TeiColumnsMetaForDataFetching,
} from '../../../types';
import { areRelativeRangeValuesSupported } from '../../../../../../utils/validators/areRelativeRangeValuesSupported';
import { DATE_TYPES, ASSIGNEE_MODES } from '../../../constants';

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

const getDateFilterContent = (dateFilter: ApiDataFilterDateContents) => {
    if (dateFilter.type === DATE_TYPES.RELATIVE) {
        if (dateFilter.period) {
            return {
                type: dateFilter.type,
                period: dateFilter.period,
            };
        }
        if (areRelativeRangeValuesSupported(dateFilter.startBuffer, dateFilter.endBuffer)) {
            return {
                type: dateFilter.type,
                startBuffer: dateFilter.startBuffer,
                endBuffer: dateFilter.endBuffer,
            };
        }
        return undefined;
    }
    if (dateFilter.type === DATE_TYPES.ABSOLUTE) {
        return {
            type: dateFilter.type,
            ge: dateFilter.startDate ? moment(dateFilter.startDate, 'YYYY-MM-DD').toISOString() : undefined,
            le: dateFilter.endDate ? moment(dateFilter.endDate, 'YYYY-MM-DD').toISOString() : undefined,
        };
    }
    return undefined;
};

const getDateFilter = ({ dateFilter }: ApiDataFilterDate) => getDateFilterContent(dateFilter);

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

const convertDataElementFilters = (filters: Array<ApiDataFilter>, columnsMetaForDataFetching: TeiColumnsMetaForDataFetching): Object =>
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

const getAssigneeFilter = async (assignedUsers: ?Array<string>, querySingleResource: QuerySingleResource) => {
    // DHIS2-12500 - The UI element provides suport for only one user
    const assignedUserId = assignedUsers && assignedUsers.length > 0 && assignedUsers[0];
    if (!assignedUserId) {
        return null;
    }
    const user = await querySingleResource({
        resource: `userLookup/${assignedUserId}`,
    });
    if (!user || !user.displayName) {
        return null;
    }
    const { id, displayName: name, username } = user;
    return { id, name, username };
};

export const convertToClientFilters = async (
    TEIQueryCriteria: ?ApiTEIQueryCriteria,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
): { [id: string]: any } => {
    let filters = {};
    if (!TEIQueryCriteria) {
        return filters;
    }
    const { programStatus, enrolledAt, occurredAt, assignedUserMode, assignedUsers, attributeValueFilters } = TEIQueryCriteria;

    if (programStatus) {
        filters = {
            ...filters,
            programStatus: {
                usingOptionSet: true,
                values: [programStatus],
            },
        };
    }
    if (enrolledAt) {
        filters = { ...filters, enrolledAt: getDateFilterContent(enrolledAt) };
    }
    if (occurredAt) {
        filters = { ...filters, occurredAt: getDateFilterContent(occurredAt) };
    }
    if (assignedUserMode && assignedUserMode !== ASSIGNEE_MODES.PROVIDED) {
        filters = { ...filters, assignee: { assignedUserMode } };
    }
    if (assignedUserMode && assignedUserMode === ASSIGNEE_MODES.PROVIDED && assignedUsers) {
        const assignedUser = await getAssigneeFilter(assignedUsers, querySingleResource);
        if (assignedUser) {
            filters = { ...filters, assignee: { assignedUserMode, assignedUser } };
        }
    }
    if (attributeValueFilters && attributeValueFilters.length > 0) {
        filters = { ...filters, ...convertDataElementFilters(attributeValueFilters, columnsMetaForDataFetching) };
    }
    return filters;
};
