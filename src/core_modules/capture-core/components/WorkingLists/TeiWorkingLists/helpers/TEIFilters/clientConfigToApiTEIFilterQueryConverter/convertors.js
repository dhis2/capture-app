// @flow
import moment from 'moment';
import {
    filterTypesObject,
    dateFilterTypes,
    type BooleanFilterData,
    type TextFilterData,
    type NumericFilterData,
    type DateFilterData,
} from '../../../../WorkingListsBase';
import type { ApiDataFilterBoolean, ApiDataFilterDateContents } from '../../../types';
import { ADDITIONAL_FILTERS } from '../../../helpers';
import { MAIN_FILTERS } from '../../../constants';

const getTextFilter = (filter: TextFilterData) => ({
    like: filter.value,
});

const getNumericFilter = (filter: NumericFilterData) => ({
    ge: filter.ge ? filter.ge.toString() : undefined,
    le: filter.le ? filter.le.toString() : undefined,
});

const getBooleanFilter = (filter: BooleanFilterData): ApiDataFilterBoolean => ({
    in: filter.values.map(value => (value ? 'true' : 'false')),
});

const getTrueOnlyFilter = () => ({
    eq: 'true',
});

const getAssigneeFilter = filter => ({
    assignedUserMode: filter.assignedUserMode,
    assignedUsers: filter.assignedUser ? [filter.assignedUser.id] : undefined,
});

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

export const getDateFilter = (dateFilter: DateFilterData) => {
    const apiDateFilterContents =
        dateFilter.type === dateFilterTypes.RELATIVE
            ? {
                type: dateFilter.type,
                period: dateFilter.period,
                startBuffer: dateFilter.startBuffer,
                endBuffer: dateFilter.endBuffer,
            }
            : {
                type: dateFilter.type,
                startDate: dateFilter.ge ? convertDate(dateFilter.ge) : undefined,
                endDate: dateFilter.le ? convertDate(dateFilter.le) : undefined,
            };

    return {
        dateFilter: apiDateFilterContents,
    };
};

export const getFilterByType = {
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

const mainFiltersTable = {
    [MAIN_FILTERS.PROGRAM_STATUS]: filter => filter.values[0],
    [MAIN_FILTERS.ENROLLED_AT]: filter => getDateFilter(filter)?.dateFilter,
    [MAIN_FILTERS.OCCURED_AT]: filter => getDateFilter(filter)?.dateFilter,
    [MAIN_FILTERS.FOLLOW_UP]: filter => Boolean(filter.values[0]),
    [MAIN_FILTERS.ASSIGNEE]: getAssigneeFilter,
    [ADDITIONAL_FILTERS.status]: filter => filter.values[0],
    [ADDITIONAL_FILTERS.occurredAt]: filter => getDateFilter(filter)?.dateFilter,
    [ADDITIONAL_FILTERS.scheduledAt]: filter => getDateFilter(filter)?.dateFilter,
};

export const convertMainFilters = ({
    filters,
    mainFilters,
}: {
    filters: Object,
    mainFilters: Array<{ id: string, type: string }>,
}): {
    programStatus?: ?string,
    occurredAt?: ?ApiDataFilterDateContents,
    enrolledAt?: ?ApiDataFilterDateContents,
    status?: ?string,
    followUp?: ?boolean,
    eventOccurredAt?: ?ApiDataFilterDateContents,
    scheduledAt?: ?ApiDataFilterDateContents,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
} =>
    Object.keys(filters).reduce((acc, key) => {
        const filter = filters[key];
        const element = mainFilters.find(mainFilter => mainFilter.id === key);
        if (!filter || !element || !mainFiltersTable[key]) {
            return acc;
        }

        const mainValue = mainFiltersTable[key](filter);
        if (mainValue) {
            if (key === MAIN_FILTERS.ASSIGNEE) {
                return { ...acc, ...mainValue };
            }
            return { ...acc, [key]: mainValue };
        }
        return acc;
    }, {});

