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
    [dataElementTypes.TEXT]: convertText,
    [dataElementTypes.NUMBER]: convertNumeric,
    [dataElementTypes.INTEGER]: convertNumeric,
    [dataElementTypes.INTEGER_POSITIVE]: convertNumeric,
    [dataElementTypes.INTEGER_NEGATIVE]: convertNumeric,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: convertNumeric,
    [dataElementTypes.DATE]: convertDate,
    [dataElementTypes.ASSIGNEE]: convertAssignee,
    [dataElementTypes.BOOLEAN]: convertBoolean,
    [dataElementTypes.TRUE_ONLY]: convertTrueOnly,
};

function convertFilter(
    sourceValue: Object,
    type: $Keys<typeof dataElementTypes>,
    meta: {
        key: string,
        listId: string,
        isInit: boolean,
    },
) {
    if (sourceValue.usingOptionSet) {
        return convertOptionSet(sourceValue, type);
    }
    // $FlowFixMe elementTypes flow error
    return mappersForTypes[type] ? mappersForTypes[type](sourceValue, meta.key, meta.listId, meta.isInit) : sourceValue;
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

    return Object
        .keys(filters)
        .filter(key => filters[key])
        .reduce((acc, key) => {
            const type = (elementsById[key] && elementsById[key].type) || mainPropTypes[key];
            if (!type) {
                log.error(errorCreator('Could not get type for key')({ key, listId, programId }));
            } else {
                const sourceValue = filters[key];
                const queryArgValue = convertFilter(
                    sourceValue,
                    type,
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
        filters: convertFilters(
            filters,
            {
                mainPropTypes,
                programId,
                listId,
                isInit,
            },
        ),
    };

    return queryArgs;
}
