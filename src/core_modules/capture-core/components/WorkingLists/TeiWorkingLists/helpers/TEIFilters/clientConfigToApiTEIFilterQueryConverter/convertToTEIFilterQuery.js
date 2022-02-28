// @flow
import log from 'loglevel';
import moment from 'moment';
import { errorCreator } from 'capture-core-utils';
import { convertValue as getApiOptionSetFilter } from './optionSet';
import { filterTypesObject, type BooleanFilterData, type TextFilterData, type NumericFilterData } from '../../../../WorkingListsBase';
import { MAIN_FILTERS, DATE_TYPES } from '../../../constants';

const getTextFilter = (filter: TextFilterData) => ({
    like: filter.value,
});

const getNumericFilter = (filter: NumericFilterData) => ({
    ge: filter.ge ? filter.ge.toString() : undefined,
    le: filter.le ? filter.le.toString() : undefined,
});

const getBooleanFilter = (filter: BooleanFilterData) => ({
    in: filter.values.map(value => (value ? 'true' : 'false')),
});

const getTrueOnlyFilter = () => ({
    eq: 'true',
});

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

const getDateFilter = (dateFilter) => {
    const apiDateFilterContents =
        dateFilter.type === DATE_TYPES.RELATIVE
            ? {
                type: dateFilter.type,
                period: dateFilter.period,
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

const getAssigneeFilter = filter => ({
    assignedUserMode: filter.assignedUserMode,
    assignedUsers: filter.assignedUser ? [filter.assignedUser.id] : undefined,
});

export const convertToTEIFilterMainFilters = ({ filters, mainFilters }: { filters: Object, mainFilters: Array<{ id: string, type: string }> }) =>
    Object.keys(filters).reduce((acc, key) => {
        const filter = filters[key];
        const element = mainFilters.find(mainFilter => mainFilter.id === key);
        if (!filter || !element) {
            return acc;
        }

        let mainValue;
        switch (key) {
        case MAIN_FILTERS.PROGRAM_STATUS:
            mainValue = filter.values[0];
            break;
        case MAIN_FILTERS.ENROLLED_AT:
            mainValue = getDateFilter(filter)?.dateFilter;
            break;
        case MAIN_FILTERS.OCCURED_AT:
            mainValue = getDateFilter(filter)?.dateFilter;
            break;
        case MAIN_FILTERS.ASSIGNEE:
            return { ...acc, ...getAssigneeFilter(filter) };
        default:
            mainValue = null;
            break;
        }
        return mainValue ? { ...acc, [key]: mainValue } : acc;
    }, {});

export const convertToTEIFilterAttributes = ({
    filters,
    attributeValueFilters,
}: {
    filters: Object,
    attributeValueFilters: Array<any>,
}): Array<any> =>
    Object.keys(filters)
        .map((key) => {
            const filter = filters[key];
            const element = attributeValueFilters.find(column => column.id === key);

            // clean here
            if (!filter || !element) {
                return null;
            }

            // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
            if (!getFilterByType[element.type]) {
                log.error(
                    errorCreator('tried to convert a filter to api value, but there was no filter converter or specification found')({
                        filter,
                        element,
                        key,
                    }),
                );
                return null;
            }

            if (filter.usingOptionSet) {
                return {
                    ...getApiOptionSetFilter(filter, element.type),
                    attribute: key,
                };
            }

            return {
                // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
                ...getFilterByType[element.type](filter),
                attribute: key,
            };
        })
        .filter(item => item);
