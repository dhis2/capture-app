// @flow
import { convertServerToClient } from '../../../../../../../converters';
import type { ApiTeis, ApiTeiAttributes, TeiColumnsMetaForDataFetchingArray, ClientTeis } from './types';

const getValuesById = (attributeValues?: ApiTeiAttributes = []) =>
    attributeValues
        .reduce((acc, { attribute, value }) => {
            acc[attribute] = value;
            return acc;
        }, {});

export const convertToClientTeis = (
    apiTeis: ApiTeis,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    programId: string,
): ClientTeis =>
    apiTeis
        .map((tei) => {
            const attributeValuesById = getValuesById(tei.attributes);
            const record = columnsMetaForDataFetching
                .map(({ id, mainProperty, type }) => {
                    let value;
                    if (mainProperty) {
                        value = tei[id];
                    } else {
                        value = attributeValuesById[id];
                    }

                    return {
                        id,
                        value: convertServerToClient(value, type),
                        urlPath: `/tracker/trackedEntities/${tei.trackedEntity}/attributes/${id}/image?dimension=small`,
                    };
                })
                .filter(({ value }) => value != null)
                .reduce((acc, { id, value, urlPath }) => {
                    acc[id] = { convertedValue: value, urlPath };
                    return acc;
                }, {});

            const programOwner = tei.programOwners.find(({ program }) => program === programId)?.orgUnit;
            if (programOwner) {
                record.programOwner = programOwner;
            }

            return {
                id: tei.trackedEntity,
                record,
            };
        });
