// @flow
import log from 'loglevel';
import { createSelector } from 'reselect';
import { errorCreator } from 'capture-core-utils';
import { getOrgUnitNames } from '../../../../../../../metadataRetrieval/orgUnitName';
import { dataElementTypes } from '../../../../../../../metaData';
import type {
    SubvalueKeysByType,
    SubvaluesByType,
    GetTeisWithSubvaluesPlainInner,
    ClientData,
} from './getSubvalues.types';
import type { TeiColumnMetaForDataFetching } from '../../../../types';
import type { QuerySingleResource } from '../../../../../../../utils/api';

const getSubvaluesPlain = (querySingleResource: QuerySingleResource, absoluteApiPath: string) => {
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

    const getOrganisationUnitSubvalue = async (keys: Array<string>) =>
        getOrgUnitNames(keys, querySingleResource);

    const subvalueGetterByType: {|
        [string]: any,
    |} = {
        [dataElementTypes.ORGANISATION_UNIT]: getOrganisationUnitSubvalue,
        [dataElementTypes.IMAGE]: getImageOrFileResourceSubvalue,
        [dataElementTypes.FILE_RESOURCE]: getImageOrFileResourceSubvalue,
    };

    const subvaluePostProcessorByType: {|
        [string]: any,
    |} = {
        [dataElementTypes.IMAGE]: ({
            subvalueKey: value,
            subvalue: name,
            urlPath,
        }) => ({
            name,
            value,
            url: `${absoluteApiPath}${urlPath}`
            ,
        }),
        [dataElementTypes.FILE_RESOURCE]: ({
            subvalueKey: value,
            subvalue: name,
        }) => ({
            name,
            value,
        }),
    };

    const getSubvalueKeysByType = (clientData: ClientData, columnsWithSubvalues: Array<TeiColumnMetaForDataFetching>): SubvalueKeysByType =>
        columnsWithSubvalues
            .map(({ id, type }) => {
                const subvalueKeys = clientData
                    .map(({ record }) => record[id]?.convertedValue)
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
                try {
                    const subvalues = await subvalueGetterByType[type](distinctSubvalueKeys);
                    return {
                        type,
                        subvalues,
                    };
                } catch (error) {
                    log.error(errorCreator('subvalue not found'));
                }
                return {
                    type,
                    subvalues: {},
                };
            });

        return Promise.all(subvaluePromises);
    };

    const addSubvalues = (clientData: ClientData, subvaluesByType: SubvaluesByType, columnsWithSubvalues: Array<TeiColumnMetaForDataFetching>): ClientData =>
        columnsWithSubvalues
            .reduce((columns, { id: columnId, type: columnType }) => {
                const { subvalues = {} } = (subvaluesByType.find(({ type }) => type === columnType) || {});
                return columns
                    .map(({ id, record }) => {
                        const subvalueKey = record[columnId]?.convertedValue;
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
                                    id,
                                    urlPath: record[columnId].urlPath,
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
            }, clientData);

    const cleanClientData = clientData =>
        clientData.map(({ id, record }) => ({
            id,
            record: Object.keys(record).reduce(
                (acc, key) => {
                    acc[key] = record[key]?.convertedValue !== undefined ? record[key].convertedValue : record[key];
                    return acc;
                },
                {},
            ),
        }));

    return async (clientData: ClientData, columnsMetaForDataFetching: Array<TeiColumnMetaForDataFetching>) => {
        const columnsWithSubvalues = columnsMetaForDataFetching
            .filter(({ type }) => subvalueGetterByType[type]);
        const subvalueKeysByType = getSubvalueKeysByType(clientData, columnsWithSubvalues);
        const subvaluesByType = await getSubvaluesByType(subvalueKeysByType);
        const clientDataWithSubValues = addSubvalues(clientData, subvaluesByType, columnsWithSubvalues);
        return cleanClientData(clientDataWithSubValues);
    };
};

export const getSubvalues =
    createSelector<QuerySingleResource, string, GetTeisWithSubvaluesPlainInner, QuerySingleResource, string>(
        query => query,
        (query, path) => path,
        (query, path) => getSubvaluesPlain(query, path));
