// @flow
import getColumnsConfiguration from './getColumnsConfiguration';
import { getEvents } from '../../../../../events/eventRequests';
import type { ColumnConfig } from './getColumnsConfiguration';
import programCollection from '../../../../../metaDataMemoryStores/programCollection/programCollection';

type InputQueryArgs = {
    programId: string,
    [key: string]: string,
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
            accMainColumns[column.id] = true;
        }
        return accMainColumns;
    }, {});

const getFilter = (filterContainer: any) => {
    if (filterContainer && filterContainer.filter) return filterContainer.filter;
    return filterContainer;
};

const getApiFilterQueryArgument = (filters: ?{ [id: string]: string}, mainColumns: { [id: string]: boolean}) => {
    const filterQueries =
        filters ?
            Object
                .keys(filters)
                // $FlowSuppress
                .filter(key => filters[key] != null && !mainColumns[key])
                .reduce((accFilterQueries, filterKey) => {
                    // $FlowSuppress
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

const getMainApiFilterQueryArguments = (filters: ?{ [id: string]: string}, mainColumns: { [id: string]: boolean}) => {
    const mainFilterQueries =
        filters ?
            Object
                .keys(filters)
                // $FlowSuppress
                .filter(key => mainColumns[key] && filters[key] != null)
                .reduce((accMainFilters, key) => {
                    // $FlowSuppress
                    const filter = getFilter(filters[key]);
                    let filtersForCurrentMain = {};
                    if (key === 'eventDate') {
                        if (Array.isArray(filter)) {
                            filtersForCurrentMain = filter
                                .reduce((accEventDateFilters, filterPart: string) => {
                                    if (filterPart.startsWith('ge')) {
                                        accEventDateFilters.startDate = filterPart.replace('ge:', '');
                                    } else {
                                        accEventDateFilters.endDate = filterPart.replace('le:', '');
                                    }
                                    return accEventDateFilters;
                                }, {});
                        } else if (filter.startsWith('ge')) {
                            filtersForCurrentMain.startDate = filter.replace('ge:', '');
                        } else {
                            filtersForCurrentMain.endDate = filter.replace('le:', '');
                        }
                    } else if (key === 'status') {
                        if (filter.startsWith('eq:')) {
                            filtersForCurrentMain.status = filter.replace('eq:', '');
                        }
                    }
                    return {
                        ...accMainFilters,
                        ...filtersForCurrentMain,
                    };
                }, {}) : null;

    return mainFilterQueries;
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
            // $FlowSuppress
            .map(key => categories[key])
            .join(';'),
    };
};

const createApiQueryArgs = (queryArgs: Object, mainColumns: Object) => {
    const apiQueryArgs = {
        ...queryArgs,
        order: `${queryArgs.sortById}:${queryArgs.sortByDirection}`,
        ...getApiFilterQueryArgument(queryArgs.filters, mainColumns),
        ...getMainApiFilterQueryArguments(queryArgs.filters, mainColumns),
        ...getApiCategoriesQueryArgument(queryArgs.categories, queryArgs.programId),
    };
    apiQueryArgs.hasOwnProperty('categories') && delete apiQueryArgs.categories;
    apiQueryArgs.hasOwnProperty('sortById') && delete apiQueryArgs.sortById;
    apiQueryArgs.hasOwnProperty('sortByDirection') && delete apiQueryArgs.sortByDirection;
    apiQueryArgs.hasOwnProperty('filters') && delete apiQueryArgs.filters;
    apiQueryArgs.hasOwnProperty('rowsCount') && delete apiQueryArgs.rowsCount;

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

export const getInitialWorkingListDataAsync = async (
    queryArgs: InputQueryArgs,
    workingListsColumnsOrder: ?Array<ColumnConfig>,
) => {
    let columnsOrderRetrieved;
    if (!workingListsColumnsOrder) {
        columnsOrderRetrieved = await getColumnsConfiguration(queryArgs.programId);
    }

    const mainColumns = getMainColumns(columnsOrderRetrieved || workingListsColumnsOrder);

    const events = await getEvents(createApiQueryArgs({
        ...queryArgs,
        page: 1,
    }, mainColumns));

    if (columnsOrderRetrieved) {
        return {
            ...events,
            columnsOrder: columnsOrderRetrieved,
        };
    }

    return events;
};

export const getUpdateWorkingListDataAsync = (
    queryArgs: InputQueryArgs,
    workingListsColumnsOrder: ?Array<ColumnConfig>,
) => {
    const mainColumns = workingListsColumnsOrder ? getMainColumns(workingListsColumnsOrder) : {};
    return getEvents(createApiQueryArgs(queryArgs, mainColumns));
};
