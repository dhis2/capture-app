// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getEventProgramThrowIfNotFound, dataElementTypes } from '../../../../../../metaData';
import {
  convertText,
  convertDate,
  convertAssignee,
  convertOptionSet,
  convertBoolean,
  convertNumeric,
  convertTrueOnly,
} from './filterConverters';

type QueryArgsSource = {
  programId: string,
  filters: Object,
  sortById: string,
  sortByDirection: string,
};

const mappersForTypes = {
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.TEXT]: convertText,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.NUMBER]: convertNumeric,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.INTEGER]: convertNumeric,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.INTEGER_POSITIVE]: convertNumeric,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.INTEGER_NEGATIVE]: convertNumeric,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.DATE]: convertDate,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.ASSIGNEE]: convertAssignee,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.BOOLEAN]: convertBoolean,
  // $FlowFixMe[prop-missing] automated comment
  [dataElementTypes.TRUE_ONLY]: convertTrueOnly,
};

function convertFilter(
  sourceValue: Object,
  type: string,
  meta: {
    key: string,
    listId: string,
    isInit: boolean,
  },
) {
  if (sourceValue.usingOptionSet) {
    // $FlowFixMe[incompatible-call] automated comment
    return convertOptionSet(sourceValue, type);
  }
  return mappersForTypes[type]
    ? mappersForTypes[type](sourceValue, meta.key, meta.listId, meta.isInit)
    : sourceValue;
}

function convertFilters(
  filters: Object,
  {
    mainPropTypes,
    programId,
    listId,
    isInit,
  }: {
    mainPropTypes: Object,
    programId: string,
    listId: string,
    isInit: boolean,
  },
) {
  const elementsById = getEventProgramThrowIfNotFound(programId).stage.stageForm.getElementsById();

  return Object.keys(filters)
    .filter((key) => filters[key])
    .reduce((acc, key) => {
      const type = (elementsById[key] && elementsById[key].type) || mainPropTypes[key];
      if (!type) {
        log.error(errorCreator('Could not get type for key')({ key, listId, programId }));
      } else {
        const sourceValue = filters[key];
        const queryArgValue = convertFilter(sourceValue, type, {
          key,
          listId,
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
    mainPropTypes,
    listId,
    isInit = false,
  }: {
    mainPropTypes: Object,
    listId: string,
    isInit: boolean,
  },
) {
  const { programId, filters } = queryArgsSource;
  const queryArgs = {
    ...queryArgsSource,
    filters: convertFilters(filters, {
      mainPropTypes,
      programId,
      listId,
      isInit,
    }),
  };

  return queryArgs;
}
