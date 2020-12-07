// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { typeof dataElementTypes } from '../../../../../../metaData';
import { filterTypesObject, type FiltersData } from '../../../WorkingLists';
import {
    convertText,
    convertDate,
    convertAssignee,
    convertOptionSet,
    convertBoolean,
    convertNumeric,
    convertTrueOnly,
} from './filterConverters';
import type { BuildFilterQueryArgsMeta } from './buildFilterQueryArgs.types';

const mappersForTypes: { [string]: Function } = {
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
    sourceValue: any,
    type: $Keys<dataElementTypes>,
    meta: {
        key: string,
        storeId: string,
        isInit: boolean,
    },
) {
    if (sourceValue && sourceValue.usingOptionSet) {
        return convertOptionSet(sourceValue, type);
    }
    return mappersForTypes[type] ? mappersForTypes[type](sourceValue, meta.key, meta.storeId, meta.isInit) : sourceValue;
}
export const buildFilterQueryArgs = (
    filters: FiltersData, {
        columns,
        storeId,
        isInit = false,
    }: BuildFilterQueryArgsMeta,
) => Object
    .keys(filters)
    .filter(key => filters[key])
    .reduce((acc, key) => {
        const column = columns.get(key);
        if (!column) {
            log.error(errorCreator('Could not get type for key')({ key, storeId }));
        } else {
            const sourceValue = filters[key];
            const queryArgValue = convertFilter(
                sourceValue,
                column.type, {
                    key,
                    storeId,
                    isInit,
                });
            acc[key] = queryArgValue;
        }
        return acc;
    }, {});
