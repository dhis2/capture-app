// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { moment } from 'capture-core-utils/moment';
import { getCustomColumnsConfiguration } from '../getCustomColumnsConfiguration';
import { getApi } from '../../../../../../../d2/d2Instance';
import { getOptionSetFilter } from './optionSet';
import { apiAssigneeFilterModes, apiDateFilterTypes } from '../../../constants';

import {
  filterTypesObject,
  type AssigneeFilterData,
  type DateFilterData,
  type BooleanFilterData,
  type TrueOnlyFilterData,
  type TextFilterData,
  type NumericFilterData,
} from '../../../../WorkingLists';
import type {
  ApiDataFilter,
  ApiDataFilterNumeric,
  ApiDataFilterText,
  ApiDataFilterBoolean,
  ApiDataFilterDate,
  ApiEventQueryCriteria,
  ColumnsMetaForDataFetching,
  ClientConfig,
} from '../../../types';

const getTextFilter = (filter: ApiDataFilterText): TextFilterData => {
  const value = filter.like;
  return {
    value,
  };
};

const getNumericFilter = (filter: ApiDataFilterNumeric): NumericFilterData => ({
  ge: filter.ge ? Number(filter.ge) : undefined,
  le: filter.le ? Number(filter.le) : undefined,
});

const getBooleanFilter = (filter: ApiDataFilterBoolean): BooleanFilterData => ({
  values: filter.in.map((value) => value === 'true'),
});

const getTrueOnlyFilter = (/* filter: ApiDataFilterTrueOnly */): TrueOnlyFilterData => ({
  value: true,
});

const getDateFilter = (filter: ApiDataFilterDate): DateFilterData => {
  if (filter.period) {
    return {
      type: apiDateFilterTypes.RELATIVE,
      period: filter.period,
    };
  }

  return {
    type: apiDateFilterTypes.ABSOLUTE,
    ge: filter.startDate ? moment(filter.startDate, 'YYYY-MM-DD').toISOString() : undefined,
    le: filter.endDate ? moment(filter.endDate, 'YYYY-MM-DD').toISOString() : undefined,
  };
};

const getUser = (userId: string) =>
  getApi()
    .get(`userLookup/${userId}`)
    .then(({ id, displayName: name, username }) => ({
      id,
      name,
      username,
    }))
    .catch((error) => {
      log.error(
        errorCreator('An error occured retrieving assignee user')({
          error,
          userId,
        }),
      );
      return null;
    });

// eslint-disable-next-line complexity
const getAssigneeFilter = async (
  assignedUserMode: $Values<typeof apiAssigneeFilterModes>,
  assignedUsers: ?Array<string>,
): Promise<?AssigneeFilterData> => {
  if (assignedUserMode === apiAssigneeFilterModes.PROVIDED) {
    const assignedUserId = assignedUsers && assignedUsers.length > 0 && assignedUsers[0];
    if (!assignedUserId) {
      return undefined;
    }

    const user = await getUser(assignedUserId);
    if (!user) {
      return undefined;
    }

    return {
      assignedUserMode,
      assignedUser: user,
    };
  }

  return {
    assignedUserMode,
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

const isOptionSetFilter = (type: $Keys<typeof filterTypesObject>, filter: any) => {
  if ([filterTypesObject.BOOLEAN].includes(type)) {
    const validBooleanValues = ['true', 'false'];
    return filter.in.some((value) => !validBooleanValues.includes[value]);
  }

  return filter.in;
};

const getSortOrder = (order: ?string) => {
  const sortOrderParts = order && order.split(':');
  if (!sortOrderParts || sortOrderParts.length !== 2) {
    return {
      sortById: 'eventDate',
      sortByDirection: 'desc',
    };
  }

  return {
    sortById: sortOrderParts[0],
    sortByDirection: sortOrderParts[1],
  };
};

const getDataElementFilters = (
  filters: ?Array<ApiDataFilter>,
  columnsMetaForDataFetching: ColumnsMetaForDataFetching,
): Array<Object> => {
  if (!filters) {
    return [];
  }

  return filters
    .map((serverFilter) => {
      const element = columnsMetaForDataFetching.get(serverFilter.dataItem);
      // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
      if (!element || !getFilterByType[element.type]) {
        return null;
      }

      // $FlowFixMe If previous test doesn't return, element.type is a key in filterTypesObject
      if (isOptionSetFilter(element.type, serverFilter)) {
        return {
          // $FlowFixMe
          ...getOptionSetFilter(serverFilter, element.type),
          id: serverFilter.dataItem,
        };
      }

      return {
        id: serverFilter.dataItem,
        // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
        ...(getFilterByType[element.type]
          // $FlowFixMe[prop-missing] automated comment
          // $FlowFixMe[incompatible-type] automated comment
          // $FlowFixMe[extra-arg] automated comment
          ? getFilterByType[element.type](serverFilter, element)
          : null),
      };
    })
    .filter((clientFilter) => clientFilter);
};

// eslint-disable-next-line complexity
const getMainDataFilters = async (
  eventQueryCriteria: ?ApiEventQueryCriteria,
  columnsMetaForDataFetching: ColumnsMetaForDataFetching,
) => {
  if (!eventQueryCriteria) {
    return [];
  }

  const { eventDate, status, assignedUserMode, assignedUsers } = eventQueryCriteria;
  const filters = [];
  if (status) {
    filters.push({
      // $FlowFixMe[incompatible-use] automated comment
      ...getOptionSetFilter({ in: [status] }, columnsMetaForDataFetching.get('status').type),
      id: 'status',
    });
  }
  if (eventDate) {
    filters.push({ ...getDateFilter(eventDate), id: 'eventDate' });
  }
  if (assignedUserMode) {
    filters.push({
      ...(await getAssigneeFilter(assignedUserMode, assignedUsers)),
      id: 'assignee',
    });
  }
  return filters;
};

const listConfigDefaults = {
  currentPage: 1,
  rowsPerPage: 15,
};

export async function convertToClientConfig(
  eventQueryCriteria: ?ApiEventQueryCriteria,
  columnsMetaForDataFetching: ColumnsMetaForDataFetching,
): Promise<ClientConfig> {
  const { sortById, sortByDirection } = getSortOrder(
    eventQueryCriteria && eventQueryCriteria.order,
  );
  const filters = [
    ...getDataElementFilters(
      eventQueryCriteria && eventQueryCriteria.dataFilters,
      columnsMetaForDataFetching,
    ),
    ...(await getMainDataFilters(eventQueryCriteria, columnsMetaForDataFetching)),
  ].reduce((acc, filter) => {
    const { id, ...filterData } = filter;
    acc[id] = filterData;
    return acc;
  }, {});

  const customColumnOrder = getCustomColumnsConfiguration(
    eventQueryCriteria && eventQueryCriteria.displayColumnOrder,
    columnsMetaForDataFetching,
  );

  return {
    filters,
    customColumnOrder,
    sortById,
    sortByDirection,
    ...listConfigDefaults,
  };
}
