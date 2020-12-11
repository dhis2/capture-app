// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { typeof dataElementTypes } from '../../../../../../metaData';
import { filterTypesObject } from '../../../WorkingLists';
import {
  convertText,
  convertDate,
  convertAssignee,
  convertOptionSet,
  convertBoolean,
  convertNumeric,
  convertTrueOnly,
} from './filterConverters';
import type { ColumnsMetaForDataFetching } from '../../types';

type QueryArgsSource = {
  filters: Object,
};

const mappersForTypes = {
  [filterTypesObject.TEXT]: convertText,
  [filterTypesObject.NUMBER]: convertNumeric,
  [filterTypesObject.INTEGER]: convertNumeric,
  [filterTypesObject.INTEGER_POSITIVE]: convertNumeric,
  [filterTypesObject.INTEGER_NEGATIVE]: convertNumeric,
  [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
  [filterTypesObject.DATE]: convertDate,
  [filterTypesObject.ASSIGNEE]: convertAssignee,
  [filterTypesObject.BOOLEAN]: convertBoolean,
  [filterTypesObject.TRUE_ONLY]: convertTrueOnly,
};

function convertFilter(
  sourceValue: Object,
  type: $Keys<dataElementTypes>,
  meta: {
    key: string,
    storeId: string,
    isInit: boolean,
  },
) {
  if (sourceValue.usingOptionSet) {
    return convertOptionSet(sourceValue, type);
  }
  // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
  return mappersForTypes[type]
    // $FlowFixMe[prop-missing] automated comment
    // $FlowFixMe[extra-arg] automated comment
    ? mappersForTypes[type](sourceValue, meta.key, meta.storeId, meta.isInit)
    : sourceValue;
}

function convertFilters(
  filters: Object,
  {
    columnsMetaForDataFetching,
    storeId,
    isInit,
  }: {
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    storeId: string,
    isInit: boolean,
  },
) {
  return Object.keys(filters)
    .filter((key) => filters[key])
    .reduce((acc, key) => {
      const column = columnsMetaForDataFetching.get(key);
      if (!column) {
        log.error(
          errorCreator('Could not get type for key')({
            key,
            storeId,
          }),
        );
      } else {
        const sourceValue = filters[key];
        const queryArgValue = convertFilter(sourceValue, column.type, {
          key,
          storeId,
          isInit,
        });
        acc[key] = queryArgValue;
      }
      return acc;
    }, {});
}

export function buildQueryArgs(
  queryArgsSource: QueryArgsSource,
  {
    columnsMetaForDataFetching,
    storeId,
    isInit = false,
  }: {
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    storeId: string,
    isInit: boolean,
  },
) {
  const { filters } = queryArgsSource;
  const queryArgs = {
    ...queryArgsSource,
    filters: convertFilters(filters, {
      columnsMetaForDataFetching,
      storeId,
      isInit,
    }),
  };

  return queryArgs;
}
