// @flow
import { convertServerToClient } from '../../../../../../../../converters';
import type { ApiTeis, ApiTeiAttributes, TeiColumnsMetaForDataFetchingArray, ClientTeis } from './types';

const getValuesById = (attributeValues?: ApiTeiAttributes) =>
    (attributeValues || [])
        .reduce((acc, { attribute, value }) => {
            acc[attribute] = value;
            return acc;
        }, {});

export const convertToClientTeis = (apiTeis: ApiTeis, columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray): ClientTeis =>
    apiTeis
        .map((tei) => {
            const attributeValuesById = getValuesById(tei.attributes);
            const record = columnsMetaForDataFetching
                .map(({ id, mainProperty, type, apiName }) => {
                    let value;
                    if (mainProperty) {
                        value = tei[apiName || id];
                    } else {
                        value = attributeValuesById[id];
                    }

                    return {
                        id,
                        value: convertServerToClient(value, type),
                    };
                })
                .filter(({ value }) => value != null)
                .reduce((acc, { id, value }) => {
                    acc[id] = value;
                    return acc;
                }, {});

            return {
                id: tei.trackedEntityInstance,
                record,
            };
        });
