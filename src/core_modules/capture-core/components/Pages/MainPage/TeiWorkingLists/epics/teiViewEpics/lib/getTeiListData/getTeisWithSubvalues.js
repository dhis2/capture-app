// @flow
import log from 'loglevel';
import { createSelector } from 'reselect';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../../../../../metaData';
import type { TeiColumnsMetaForDataFetchingArray, ClientTeis } from './types';
import type { SubvalueKeysByType, SubvaluesByType, GetTeisWithSubvaluesPlainInner } from './getTeisWithSubvalues.types';
import type { QuerySingleResource } from '../../../../../../../../utils/api';

const getTeisWithSubvaluesPlain = (querySingleResource: QuerySingleResource, absoluteApiPath: string) => {
    const getImageOrFileResourceSubvalue = async (keys: Array<string>) => {
        const promises = keys
            .map(async (key) => {
                const { id, displayName: name } = await querySingleResource({ resource: 'fileResources', id: key });
                return {
                    id,
                    name,
                };
            });

        return (await Promise.all(promises))
            .reduce((acc, { id, name }) => {
                acc[id] = name;
                return acc;
            }, {});
    };

    const subvalueGetterByType: {|[string]: any |} = {
        [dataElementTypes.ORGANISATION_UNIT]: async (keys: Array<string>) => {
            const ids = keys
                .join(',');

            const { organisationUnits = [] } = await querySingleResource({ resource: 'organisationUnits', params: { filter: `id:in:[${ids}]` } });

            return organisationUnits
                .reduce((acc, { id, displayName: name }) => {
                    acc[id] = {
                        id,
                        name,
                    };
                    return acc;
                }, {});
        },
        [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
        [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    };

    const subvaluePostProcessorByType: {|[string]: any |} = {
        [dataElementTypes.IMAGE]: ({
            subvalueKey: value,
            subvalue: name,
            columnId,
            teiId,
        }) => ({
            name,
            value,
            url: `${absoluteApiPath}/trackedEntityInstances/${teiId}/${columnId}/image`,
        }),
        [dataElementTypes.FILE_RESOURCE]: ({
            subvalueKey: value,
            subvalue: name,
        }) => ({
            name,
            value,
        }),
    };

    const getSubvalueKeysByType = (clientTeis: ClientTeis, columnsWithSubvalues: TeiColumnsMetaForDataFetchingArray): SubvalueKeysByType =>
        columnsWithSubvalues
            .map(({ id, type }) => {
                const subvalueKeys = clientTeis
                    .map(({ record }) => record[id])
                    .filter(value => value != null);

                return {
                    type,
                    subvalueKeys,
                };
            }).reduce((acc, { type, subvalueKeys }) => {
                if (subvalueKeys.length > 0) {
                    acc[type] = [
                        ...(acc[type] || []),
                        ...subvalueKeys,
                    ];
                }
                return acc;
            }, {});

    const getSubvaluesByType = (subvalueKeysByType: SubvalueKeysByType): Promise<SubvaluesByType> => {
        const subvaluePromises = Object
            .keys(subvalueKeysByType)
            .map(async (type) => {
                const subvalueKeys = subvalueKeysByType[type];
                const distinctSubvalueKeys = [...new Set(subvalueKeys).values()];
                const subvalues = await subvalueGetterByType[type](distinctSubvalueKeys);

                return {
                    type,
                    subvalues,
                };
            });

        return Promise.all(subvaluePromises);
    };

    const addSubvaluesToTeis = (clientTeis: ClientTeis, subvaluesByType: SubvaluesByType, columnsWithSubvalues: TeiColumnsMetaForDataFetchingArray): ClientTeis =>
        columnsWithSubvalues
            .reduce((teis, { id: columnId, type: columnType }) => {
                const { subvalues = {} } = (subvaluesByType.find(({ type }) => type === columnType) || {});
                return teis
                    .map(({ id, record }) => {
                        const subvalueKey = record[columnId];
                        if (subvalueKey == null) {
                            return {
                                id,
                                record,
                            };
                        }

                        const subvalue = subvalues[subvalueKey];
                        let processedSubvalue;
                        if (subvalue == null) {
                            log.error(errorCreator('subvalue not found')({ subvalueKey, id, record }));
                            processedSubvalue = undefined;
                        } else {
                            processedSubvalue = subvaluePostProcessorByType[columnType] ?
                                subvaluePostProcessorByType[columnType]({
                                    subvalueKey,
                                    subvalue,
                                    columnId,
                                    teiId: id,
                                }) :
                                subvalue;
                        }

                        return {
                            id,
                            record: {
                                ...record,
                                [columnId]: processedSubvalue,
                            },
                        };
                    });
            }, clientTeis);

    return async (clientTeis: ClientTeis, columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray) => {
        const columnsWithSubvalues = columnsMetaForDataFetching
            .filter(({ type }) => subvalueGetterByType[type]);
        const subvalueKeysByType = getSubvalueKeysByType(clientTeis, columnsWithSubvalues);
        const subvaluesByType = await getSubvaluesByType(subvalueKeysByType);
        return addSubvaluesToTeis(clientTeis, subvaluesByType, columnsWithSubvalues);
    };
};

export const getTeisWithSubvalues =
    createSelector<QuerySingleResource, string, GetTeisWithSubvaluesPlainInner, QuerySingleResource, string>(
        query => query,
        (query, path) => path,
        (query, path) => getTeisWithSubvaluesPlain(query, path));
