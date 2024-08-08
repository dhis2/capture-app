// @flow
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { convertServerToClient } from '../../../../../../../converters';
import type { ApiTeis, ApiTeiAttributes, TeiColumnsMetaForDataFetchingArray, ClientTeis } from './types';
import { dataElementTypes } from '../../../../../../../metaData';

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

                    const urls = (type === dataElementTypes.IMAGE) ?
                        (() => (featureAvailable(FEATURES.trackerImageEndpoint) ?
                            {
                                imageUrl: `/tracker/trackedEntities/${tei.trackedEntity}/attributes/${id}/image?program=${programId}`,
                                previewUrl: `/tracker/trackedEntities/${tei.trackedEntity}/attributes/${id}/image?program=${programId}&dimension=small`,
                            } : {
                                imageUrl: `/trackedEntityInstances/${tei.trackedEntity}/${id}/image?program=${programId}`,
                                previewUrl: `/trackedEntityInstances/${tei.trackedEntity}/${id}/image?program=${programId}&dimension=SMALL`,
                            }
                        ))() : {};

                    return {
                        id,
                        value: convertServerToClient(value, type),
                        ...urls,
                    };
                })
                .filter(({ value }) => value != null)
                .reduce((acc, { id, value, imageUrl, previewUrl }: any) => {
                    acc[id] = {
                        convertedValue: value,
                        ...(imageUrl ? { imageUrl, previewUrl } : {}),
                    };
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
