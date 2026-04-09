import moment from 'moment';
import {
    dateFilterTypes,
    filterTypesObject,
} from '../../../../WorkingListsBase';
import type { TextValueFilterData } from '../../../../../FiltersForTypes/Text/text.types';
import type { NumericRangeFilterData } from '../../../../../FiltersForTypes/Numeric/numeric.types';
import type { TimeRangeFilterData } from '../../../../../FiltersForTypes/Time/time.types';
import type { BooleanValueFilterData } from '../../../../../FiltersForTypes/Boolean/boolean.types';
import type { OrgUnitValueFilterData } from '../../../../../FiltersForTypes/OrgUnit/orgUnit.types';
import type { AbsoluteDateFilterData, RelativeDateFilterData } from '../../../../../FiltersForTypes/Date/date.types';
import type { DateTimeAbsoluteFilterData } from '../../../../../FiltersForTypes/DateTime/dateTime.types';
import type { ApiDataFilterBoolean, ApiDataFilterDateContents } from '../../../types';
import { MAIN_FILTERS } from '../../../constants';
import { ADDITIONAL_FILTERS } from '../../eventFilters';
import type { ApiDataFilterOrgUnit } from '../../../../EventWorkingLists/types';

const getTextFilter = (filter: TextValueFilterData, element?: { searchOperator?: string }) => {
    const searchOperator = element?.searchOperator?.toLowerCase() ?? 'like';
    return { [searchOperator]: filter.value };
};

const getNumericFilter = (filter: NumericRangeFilterData) => ({
    ge: filter.ge?.toString() ?? undefined,
    le: filter.le?.toString() ?? undefined,
});

const getTimeFilter = (filter: TimeRangeFilterData) => ({
    ge: filter.ge ?? undefined,
    le: filter.le ?? undefined,
});

const getBooleanFilter = (filter: BooleanValueFilterData): ApiDataFilterBoolean => ({
    in: filter.values.map(value => (value ? 'true' : 'false')),
});

const getTrueOnlyFilter = () => ({
    eq: 'true',
});

const getAssigneeFilter = (filter: any) => ({
    assignedUserMode: filter.assignedUserMode,
    assignedUsers: filter.assignedUser ? [filter.assignedUser.id] : undefined,
});

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

export const getDateFilter = (dateFilter: AbsoluteDateFilterData | RelativeDateFilterData) => {
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

const getOrgUnitFilter = (filter: OrgUnitValueFilterData): ApiDataFilterOrgUnit => ({
    eq: filter.value,
});

export const getDateTimeFilter = (dateFilter: DateTimeAbsoluteFilterData) => ({
    dateFilter: {
        type: dateFilterTypes.ABSOLUTE,
        startDate: dateFilter.ge ?? undefined,
        endDate: dateFilter.le ?? undefined,
    },
});

export const getFilterByType = {
    [filterTypesObject.AGE]: getDateFilter,
    [filterTypesObject.BOOLEAN]: getBooleanFilter,
    [filterTypesObject.COORDINATE]: getTextFilter,
    [filterTypesObject.DATE]: getDateFilter,
    [filterTypesObject.DATETIME]: getDateTimeFilter,
    [filterTypesObject.EMAIL]: getTextFilter,
    [filterTypesObject.FILE_RESOURCE]: getTextFilter,
    [filterTypesObject.IMAGE]: getTextFilter,
    [filterTypesObject.INTEGER]: getNumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [filterTypesObject.LONG_TEXT]: getTextFilter,
    [filterTypesObject.NUMBER]: getNumericFilter,
    [filterTypesObject.ORGANISATION_UNIT]: getOrgUnitFilter,
    [filterTypesObject.PERCENTAGE]: getNumericFilter,
    [filterTypesObject.PHONE_NUMBER]: getTextFilter,
    [filterTypesObject.TEXT]: getTextFilter,
    [filterTypesObject.TIME]: getTimeFilter,
    [filterTypesObject.TRUE_ONLY]: getTrueOnlyFilter,
    [filterTypesObject.URL]: getTextFilter,
    [filterTypesObject.USERNAME]: getTextFilter,
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
    filters: any;
    mainFilters: Array<{ id: string; type: string }>;
}): {
    programStatus?: string;
    occurredAt?: ApiDataFilterDateContents;
    enrolledAt?: ApiDataFilterDateContents;
    status?: string;
    followUp?: boolean;
    eventOccurredAt?: ApiDataFilterDateContents;
    scheduledAt?: ApiDataFilterDateContents;
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY';
    assignedUsers?: string[];
} =>
    Object.keys(filters).reduce((acc, key) => {
        const filter = filters[key];
        const element = mainFilters.find(mainFilter => mainFilter.id === key);
        if (!filter || !element || !mainFiltersTable[key]) {
            return acc;
        }

        const mainValue = mainFiltersTable[key](filter);

        if (mainValue !== undefined) {
            if (key === MAIN_FILTERS.ASSIGNEE) {
                return { ...acc, ...mainValue };
            }
            return { ...acc, [key]: mainValue };
        }
        return acc;
    }, {});

