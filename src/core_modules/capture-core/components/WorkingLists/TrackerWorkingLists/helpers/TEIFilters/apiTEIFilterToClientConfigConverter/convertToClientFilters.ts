import moment from 'moment';
import type { QuerySingleResource } from 'capture-core/utils/api';
import { getOptionSetFilter } from './optionSet';
import {
    filterTypesObject,
    type TrueOnlyFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../WorkingListsBase';
import type {
    ApiDataFilter,
    ApiDataFilterNumeric,
    ApiDataFilterText,
    ApiDataFilterTextUnique,
    ApiDataFilterBoolean,
    ApiDataFilterDate,
    ApiDataFilterDateContents,
    ApiDataFilterOptionSet,
    ApiTrackerQueryCriteria,
    TeiColumnsMetaForDataFetching,
} from '../../../types';
import { areRelativeRangeValuesSupported }
    from '../../../../../../utils/validation/validators/areRelativeRangeValuesSupported';
import { DATE_TYPES, ASSIGNEE_MODES, MAIN_FILTERS } from '../../../constants';
import { ADDITIONAL_FILTERS } from '../../eventFilters';
import { type DataElement } from '../../../../../../metaData';
import { fromApiEmptyValueFilter } from '../../../../../FiltersForTypes/EmptyValue';

const getTextFilter = (
    filter: ApiDataFilterText & ApiDataFilterTextUnique,
    dataElement?: DataElement,
): TextFilterData | undefined => {
    const value = dataElement?.unique
        ? filter.eq ?? filter.like
        : filter.like;
    return value ? { value } : undefined;
};

const getNumericFilter = (filter: ApiDataFilterNumeric): NumericFilterData | undefined => {
    if (filter.ge || filter.le) {
        return {
            ge: Number(filter.ge),
            le: Number(filter.le),
        };
    }
    return undefined;
};

// Api returns a boolean as an object if we filter attributes, but it returns a boolean if it's a main filter
const getBooleanFilter = (filter: ApiDataFilterBoolean): any => {
    if (typeof filter === 'boolean') {
        return { values: [filter] };
    }
    if (filter.in) {
        return { values: filter.in.map(value => value === 'true') };
    }
    return undefined;
};

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
    if (dateFilter.type === DATE_TYPES.ABSOLUTE && (dateFilter.startDate || dateFilter.endDate)) {
        return {
            type: dateFilter.type,
            ge: moment(dateFilter.startDate, 'YYYY-MM-DD').toISOString(),
            le: moment(dateFilter.endDate, 'YYYY-MM-DD').toISOString(),
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
    [filterTypesObject.AGE]: getDateFilter,
    [filterTypesObject.BOOLEAN]: getBooleanFilter,
    [filterTypesObject.COORDINATE]: getTextFilter,
    [filterTypesObject.DATE]: getDateFilter,
    [filterTypesObject.DATETIME]: getDateFilter,
    [filterTypesObject.EMAIL]: getTextFilter,
    [filterTypesObject.FILE_RESOURCE]: getTextFilter,
    [filterTypesObject.IMAGE]: getTextFilter,
    [filterTypesObject.INTEGER]: getNumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [filterTypesObject.LONG_TEXT]: getTextFilter,
    [filterTypesObject.MULTI_TEXT]: getTextFilter,
    [filterTypesObject.NUMBER]: getNumericFilter,
    [filterTypesObject.ORGANISATION_UNIT]: getTextFilter,
    [filterTypesObject.PERCENTAGE]: getTextFilter,
    [filterTypesObject.PHONE_NUMBER]: getTextFilter,
    [filterTypesObject.TEXT]: getTextFilter,
    [filterTypesObject.TIME]: getDateFilter,
    [filterTypesObject.TRUE_ONLY]: getTrueOnlyFilter,
    [filterTypesObject.URL]: getTextFilter,
    [filterTypesObject.USERNAME]: getTextFilter,
};

const getAssigneeFilter = async (assignedUsers: Array<string> | null, querySingleResource: QuerySingleResource) => {
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

const getAssignee = async (assignedUserMode, assignedUsers, querySingleResource) => {
    if (assignedUserMode && assignedUserMode !== ASSIGNEE_MODES.PROVIDED) {
        return { assignedUserMode };
    }
    if (assignedUserMode && assignedUserMode === ASSIGNEE_MODES.PROVIDED && assignedUsers) {
        const assignedUser = await getAssigneeFilter(assignedUsers, querySingleResource);
        if (assignedUser) {
            return { assignedUserMode, assignedUser };
        }
    }
    return null;
};

const getMainFilterOptionSet = value => ({
    usingOptionSet: true,
    values: [value],
});

const mainFiltersTable = {
    [MAIN_FILTERS.PROGRAM_STATUS]: getMainFilterOptionSet,
    [MAIN_FILTERS.ENROLLED_AT]: getDateFilterContent,
    [MAIN_FILTERS.OCCURED_AT]: getDateFilterContent,
    [MAIN_FILTERS.FOLLOW_UP]: getBooleanFilter,
    [ADDITIONAL_FILTERS.programStage]: getMainFilterOptionSet,
    [ADDITIONAL_FILTERS.status]: getMainFilterOptionSet,
    [ADDITIONAL_FILTERS.occurredAt]: getDateFilterContent,
    [ADDITIONAL_FILTERS.scheduledAt]: getDateFilterContent,
};

const convertDataElementFilters = (
    filters: ApiDataFilter[] | undefined,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
): any =>
    filters?.reduce((acc, serverFilter: any) => {
        const element = columnsMetaForDataFetching.get(serverFilter.dataItem);

        if (!element || !getFilterByType[element.type]) {
            return acc;
        }

        const emptyValueFilter = fromApiEmptyValueFilter(serverFilter);
        if (emptyValueFilter) {
            return { ...acc, [serverFilter.dataItem]: emptyValueFilter };
        }

        const value = isOptionSetFilter(element.type, serverFilter)
            ? getOptionSetFilter(serverFilter, element.type)
            : getFilterByType[element.type](serverFilter);

        return value ? { ...acc, [serverFilter.dataItem]: value } : acc;
    }, {});

const convertAttributeFilters = (
    filters: ApiDataFilter[] | undefined,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
): any =>
    filters?.reduce((acc, serverFilter: any) => {
        const element = columnsMetaForDataFetching.get(serverFilter.attribute);

        if (!element || !getFilterByType[element.type]) {
            return acc;
        }

        const emptyValueFilter = fromApiEmptyValueFilter(serverFilter);
        if (emptyValueFilter) {
            return { ...acc, [serverFilter.attribute]: emptyValueFilter };
        }

        const value = isOptionSetFilter(element.type, serverFilter)
            ? getOptionSetFilter(serverFilter, element.type)
            : getFilterByType[element.type](serverFilter, element);

        return value ? { ...acc, [serverFilter.attribute]: value } : acc;
    }, {});

const convertToClientMainFilters = (TEIQueryCriteria: any) =>
    Object.entries(TEIQueryCriteria).reduce((acc, [key, value]) => {
        if (!mainFiltersTable[key] || value === undefined) {
            return acc;
        }

        const mainValue = mainFiltersTable[key](value as any);
        return mainValue ? { ...acc, [key]: mainValue } : acc;
    }, {});

export const convertToClientFilters = async (
    TEIQueryCriteria: ApiTrackerQueryCriteria | null | undefined,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
): Promise<{ [id: string]: any }> => {
    if (!TEIQueryCriteria) {
        return {};
    }
    const { assignedUserMode, assignedUsers, attributeValueFilters, dataFilters, ...restTEIQueryCriteria } =
        TEIQueryCriteria;
    const assignee = await getAssignee(assignedUserMode, assignedUsers, querySingleResource);

    return {
        assignee,
        ...convertToClientMainFilters(restTEIQueryCriteria),
        ...convertAttributeFilters(attributeValueFilters, columnsMetaForDataFetching),
        ...convertDataElementFilters(dataFilters, columnsMetaForDataFetching),
    };
};
