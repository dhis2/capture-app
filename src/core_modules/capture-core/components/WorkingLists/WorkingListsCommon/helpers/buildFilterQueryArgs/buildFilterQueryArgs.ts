import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../../metaData';
import { filterTypesObject } from '../../../WorkingListsBase';
import type { FiltersData } from '../../../WorkingListsBase';
import {
    convertText,
    convertDate,
    convertDateTime,
    convertTime,
    convertAssignee,
    convertOptionSet,
    convertBoolean,
    convertNumeric,
    convertTrueOnly,
    convertOrgUnit,
} from './filterConverters';
import type { BuildFilterQueryArgsMeta } from './buildFilterQueryArgs.types';
import { API_NOT_EMPTY_VALUE_FILTER, API_EMPTY_VALUE_FILTER } from '../../../../FiltersForTypes/EmptyValue';

const mappersForTypes = {
    [filterTypesObject.AGE]: convertDate,
    [filterTypesObject.ASSIGNEE]: convertAssignee,
    [filterTypesObject.BOOLEAN]: convertBoolean,
    [filterTypesObject.COORDINATE]: convertText,
    [filterTypesObject.DATE]: convertDate,
    [filterTypesObject.DATETIME]: convertDateTime,
    [filterTypesObject.TIME]: convertTime,
    [filterTypesObject.EMAIL]: convertText,
    [filterTypesObject.FILE_RESOURCE]: convertText,
    [filterTypesObject.IMAGE]: convertText,
    [filterTypesObject.INTEGER]: convertNumeric,
    [filterTypesObject.INTEGER_NEGATIVE]: convertNumeric,
    [filterTypesObject.INTEGER_POSITIVE]: convertNumeric,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    [filterTypesObject.LONG_TEXT]: convertText,
    [filterTypesObject.NUMBER]: convertNumeric,
    [filterTypesObject.ORGANISATION_UNIT]: convertOrgUnit,
    [filterTypesObject.PERCENTAGE]: convertText,
    [filterTypesObject.PHONE_NUMBER]: convertText,
    [filterTypesObject.TEXT]: convertText,
    [filterTypesObject.TRUE_ONLY]: convertTrueOnly,
    [filterTypesObject.URL]: convertText,
    [filterTypesObject.USERNAME]: convertText,
};

function convertFilter(
    sourceValue: any,
    type: keyof typeof dataElementTypes,
    meta: {
        key: string;
        storeId: string;
        isInit: boolean;
    },
    searchOperator?: string,
) {
    if (typeof sourceValue.isEmpty === 'boolean') {
        return sourceValue.isEmpty ? API_EMPTY_VALUE_FILTER : API_NOT_EMPTY_VALUE_FILTER;
    }
    if (sourceValue && sourceValue.usingOptionSet) {
        return convertOptionSet(sourceValue, type);
    }
    return mappersForTypes[type] ? mappersForTypes[type]({ sourceValue, meta, searchOperator }) : sourceValue;
}
export const buildFilterQueryArgs = (
    filters: FiltersData, {
        columns,
        filtersOnly,
        storeId,
        isInit = false,
    }: BuildFilterQueryArgsMeta,
) => Object
    .keys(filters)
    .filter(key => filters[key])
    .reduce((acc, key) => {
        const { type, searchOperator } = columns.get(key) || filtersOnly?.get(key) || {};
        if (!type) {
            log.error(errorCreator('Could not get type for key')({ key, storeId }));
        } else {
            const sourceValue = filters[key];
            const queryArgValue = convertFilter(
                sourceValue,
                type,
                {
                    key,
                    storeId,
                    isInit,
                },
                searchOperator,
            );
            acc[key] = queryArgValue;
        }
        return acc;
    }, {});
