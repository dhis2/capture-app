// @flow
import { getEvents } from '../../../../../events/eventRequests';
import type { ColumnConfig } from '../../WorkingLists';
import programCollection from '../../../../../metaDataMemoryStores/programCollection/programCollection';

type InputQueryArgs = {
    [key: string]: any,
};

const mapArgumentNameFromClientToServer = {
    programId: 'program',
    orgUnitId: 'orgUnit',
    rowsPerPage: 'pageSize',
    currentPage: 'page',
};

const getMainColumns = (columnsOrder: Array<ColumnConfig>) => columnsOrder
    .reduce((accMainColumns, column) => {
        if (column.isMainProperty) {
            accMainColumns[column.id] = column;
        }
        return accMainColumns;
    }, {});

const getFilter = (filterContainer: any) => filterContainer;

const getApiFilterQueryArgument = (filters: ?{ [id: string]: string}, mainColumns: { [id: string]: Object}) => {
    const filterQueries =
        filters ?
            Object
                .keys(filters)

                .filter(key => filters[key] != null && !mainColumns[key])
                .reduce((accFilterQueries, filterKey) => {
                    const filter = getFilter(filters[filterKey]);
                    if (Array.isArray(filter)) {
                        const filtersFromArray = filter
                            .map(filterPart => `${filterKey}:${filterPart}`);
                        accFilterQueries = [...accFilterQueries, ...filtersFromArray];
                    } else {
                        accFilterQueries.push(`${filterKey}:${filter}`);
                    }
                    return accFilterQueries;
                }, []) :
            null;

    const filterArgument = filterQueries && filterQueries.length > 0 ? { filter: filterQueries } : null;
    return filterArgument;
};

const getEventDateQueryArgs = (filter: Array<string> | string) => {
    let eventDateQueryArgs = {};
    if (Array.isArray(filter)) {
        eventDateQueryArgs = filter
            .reduce((accEventDateQueryArgs, filterPart: string) => {
                if (filterPart.startsWith('ge')) {
                    accEventDateQueryArgs.startDate = filterPart.replace('ge:', '');
                } else {
                    accEventDateQueryArgs.endDate = filterPart.replace('le:', '');
                }
                return accEventDateQueryArgs;
            }, {});
    } else if (filter.startsWith('ge')) {
        eventDateQueryArgs.startDate = filter.replace('ge:', '');
    } else {
        eventDateQueryArgs.endDate = filter.replace('le:', '');
    }
    return eventDateQueryArgs;
};

const getStatusQueryArgs = (filter: string) => {
    const statusQueryArgs = {
        status: filter.replace('in:', ''),
    };
    return statusQueryArgs;
};

const getMainApiFilterQueryArguments = (filters: ?{ [id: string]: string}, mainColumns: { [id: string]: Object}) => {
    const mainFilterQueryArgs =
        filters ?
            Object
                .keys(filters)

                .filter(key => mainColumns[key] && filters[key] != null)
                .reduce((accMainQueryArgs, key) => {
                    const filter = getFilter(filters[key]);
                    let queryArgsForCurrentMain = {};
                    if (key === 'eventDate') {
                        queryArgsForCurrentMain = getEventDateQueryArgs(filter);
                    } else if (key === 'status') {
                        queryArgsForCurrentMain = getStatusQueryArgs(filter);
                    } else if (key === 'assignee') {
                        queryArgsForCurrentMain = filter;
                    }
                    return {
                        // $FlowFixMe[exponential-spread] automated comment
                        ...accMainQueryArgs,
                        ...queryArgsForCurrentMain,
                    };
                }, {}) : null;

    return mainFilterQueryArgs;
};

const getApiCategoriesQueryArgument = (categories: ?{ [id: string]: string}, programId: string) => {
    if (!categories) {
        return null;
    }

    const program = programCollection.get(programId);
    if (!program) {
        return null;
    }

    const categoryCombination = program.categoryCombination;
    if (!categoryCombination) {
        return null;
    }

    return {
        attributeCc: categoryCombination.id,
        attributeCos: Object
            .keys(categories)

            .map(key => categories[key])
            .join(';'),
    };
};

const getApiOrderById = (sortById: string, mainColumns: Object) => {
    if (mainColumns[sortById]) {
        const columnSpec = mainColumns[sortById];
        if (columnSpec.apiName) {
            return columnSpec.apiName;
        }
    }
    return sortById;
};

const getApiOrderByQueryArgument = (sortById: string, sortByDirection: string, mainColumns: Object) => {
    const apiId = getApiOrderById(sortById, mainColumns);
    return `${apiId}:${sortByDirection}`;
};

// eslint-disable-next-line complexity
const createApiQueryArgs = (queryArgs: Object, mainColumns: Object) => {
    let apiQueryArgs = {
        ...queryArgs,
        order: getApiOrderByQueryArgument(queryArgs.sortById, queryArgs.sortByDirection, mainColumns),
        ...getApiFilterQueryArgument(queryArgs.filters, mainColumns),
        // $FlowFixMe[exponential-spread] automated comment
        ...getMainApiFilterQueryArguments(queryArgs.filters, mainColumns),
        ...getApiCategoriesQueryArgument(queryArgs.categories, queryArgs.programId),
    };
    apiQueryArgs.hasOwnProperty('categories') && delete apiQueryArgs.categories;
    apiQueryArgs.hasOwnProperty('sortById') && delete apiQueryArgs.sortById;
    apiQueryArgs.hasOwnProperty('sortByDirection') && delete apiQueryArgs.sortByDirection;
    apiQueryArgs.hasOwnProperty('filters') && delete apiQueryArgs.filters;
    apiQueryArgs.hasOwnProperty('rowsCount') && delete apiQueryArgs.rowsCount;

    apiQueryArgs = Object
        .keys(apiQueryArgs)
        .reduce((acc, key) => {
            const value = apiQueryArgs[key];
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

    const apiQueryArgsWithServerPropName = Object
        .keys(apiQueryArgs)
        .reduce((accApiQueryArgs, key) => {
            if (mapArgumentNameFromClientToServer[key]) {
                accApiQueryArgs[mapArgumentNameFromClientToServer[key]] = apiQueryArgs[key];
            } else {
                accApiQueryArgs[key] = apiQueryArgs[key];
            }
            return accApiQueryArgs;
        }, {});

    return apiQueryArgsWithServerPropName;
};

export const getEventWorkingListDataAsync = async (
    queryArgs: InputQueryArgs,
    workingListsColumnsOrder: Array<ColumnConfig>,
) => {
    const mainColumns = getMainColumns(workingListsColumnsOrder);
    const events = await getEvents(createApiQueryArgs(queryArgs, mainColumns));
    return events;
};
