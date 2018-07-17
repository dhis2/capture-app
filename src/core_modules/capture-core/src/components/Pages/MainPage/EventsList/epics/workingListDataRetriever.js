// @flow
import getColumnsConfiguration from './getColumnsConfiguration';
import { getEvents } from '../../../../../events/eventRequests';

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

const getApiFilterQueryArgument = (filters: ?{ [id: string]: string}) => {
    const filterQueries =
        filters ?
            Object
                .keys(filters)
                // $FlowSuppress
                .filter(key => filters[key] != null)
                .reduce((accFilterQueries, filterKey) => {
                    // $FlowSuppress
                    const filter = filters[filterKey];
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

const createApiQueryArgs = (queryArgs: Object) => {
    const apiQueryArgs = {
        ...queryArgs,
        order: `${queryArgs.sortById}:${queryArgs.sortByDirection}`,
        ...queryArgs.categories,
        ...getApiFilterQueryArgument(queryArgs.filters),
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
    isColumnConfigAlreadyRetrieved: boolean,
) => {
    const eventsPromise = getEvents(createApiQueryArgs({
        ...queryArgs,
        page: 1,
    }));

    if (isColumnConfigAlreadyRetrieved) {
        return eventsPromise;
    }

    const columnsConfigPromise = getColumnsConfiguration(queryArgs.programId);

    const promiseData = await Promise.all([
        eventsPromise,
        columnsConfigPromise,
    ]);

    return {
        ...promiseData[0],
        columnsOrder: promiseData[1],
    };
};

export const getUpdateWorkingListDataAsync = (
    queryArgs: InputQueryArgs,
) => getEvents(createApiQueryArgs(queryArgs));
