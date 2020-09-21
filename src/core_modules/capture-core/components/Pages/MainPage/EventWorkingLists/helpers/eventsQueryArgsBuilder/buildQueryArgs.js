// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../../../metaData';
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
    return mappersForTypes[type] ?
        mappersForTypes[type](sourceValue, meta.key, meta.listId, meta.isInit) :
        sourceValue;
}

function convertFilters(
    filters: Object,
    {
        columnsMetaForDataFetching,
        listId,
        isInit,
    }: {
        columnsMetaForDataFetching: ColumnsMetaForDataFetching,
        listId: string,
        isInit: boolean,
    },
) {
    return Object
        .keys(filters)
        .filter(key => filters[key])
        .reduce((acc, key) => {
            const column = columnsMetaForDataFetching.get(key);
            if (!column) {
                log.error(errorCreator('Could not get type for key')({ key, listId }));
            } else {
                const sourceValue = filters[key];
                const queryArgValue = convertFilter(
                    sourceValue,
                    column.type,
                    {
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
        columnsMetaForDataFetching,
        listId,
        isInit = false,
    }: {
        columnsMetaForDataFetching: ColumnsMetaForDataFetching,
        listId: string,
        isInit: boolean,
    },
) {
    const { filters } = queryArgsSource;
    const queryArgs = {
        ...queryArgsSource,
        filters: convertFilters(
            filters,
            {
                columnsMetaForDataFetching,
                listId,
                isInit,
            },
        ),
    };

    return queryArgs;
}
