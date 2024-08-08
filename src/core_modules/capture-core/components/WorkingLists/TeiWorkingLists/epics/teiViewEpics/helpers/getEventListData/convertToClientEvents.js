// @flow
import { translatedStatusTypes } from 'capture-core/events/statusTypes';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { convertServerToClient } from '../../../../../../../converters';
import type {
    ApiEvents,
    ApiEvent,
    ApiTeiAttributes,
    ApiTei,
    ApiDataElement,
    TeiColumnsMetaForDataFetchingArray,
    ClientEvents,
} from './types';
import { getFilterClientName, ADDITIONAL_FILTERS } from '../../../../helpers';
import { isEventOverdue } from '../../../../../../../utils/isEventOverdue';
import { dataElementTypes } from '../../../../../../../metaData';

const convertServerStatusToClient = (
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    scheduledAt: string,
) => {
    const translatedStatus = translatedStatusTypes();
    if (isEventOverdue({ status, scheduledAt })) {
        return translatedStatus.OVERDUE;
    }
    return translatedStatus[status];
};

const getAttributeById = (attributeValues?: ApiTeiAttributes = []) =>
    attributeValues.reduce((acc, { attribute, value }) => {
        acc[attribute] = value;
        return acc;
    }, {});

const buildTEIRecord = ({
    columnsMetaForDataFetching,
    apiTEI,
    attributeValuesById,
    trackedEntity,
    programId,
}: {
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    apiTEI: ApiTei,
    attributeValuesById: Object,
    trackedEntity: string,
    programId: string,
}) =>
    columnsMetaForDataFetching.map(({ id, mainProperty, type }) => {
        const value = mainProperty ? apiTEI[id] : attributeValuesById[id];
        const urls = (type === dataElementTypes.IMAGE) ?
            (() => (featureAvailable(FEATURES.trackerImageEndpoint) ?
                {
                    imageUrl: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image?program=${programId}`,
                    previewUrl: `/tracker/trackedEntities/${trackedEntity}/attributes/${id}/image?program=${programId}&dimension=small`,
                } : {
                    imageUrl: `/trackedEntityInstances/${trackedEntity}/${id}/image?program=${programId}`,
                    previewUrl: `/trackedEntityInstances/${trackedEntity}/${id}/image?program=${programId}&dimension=SMALL`,
                }
            ))() : {};

        return {
            id,
            value: convertServerToClient(value, type),
            ...urls,
        };
    });

const getDataValuesById = (dataValues?: ApiDataElement = []) =>
    dataValues.reduce((acc, { dataElement, value }) => {
        acc[dataElement] = value;
        return acc;
    }, {});

const buildEventRecord = ({
    columnsMetaForDataFetching,
    apiEvent,
    dataValuesById,
}: {
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    apiEvent: ApiEvent,
    dataValuesById: Object,
}) =>
    columnsMetaForDataFetching.map(({ id, mainProperty, type }) => {
        const isStatus = mainProperty && id === ADDITIONAL_FILTERS.status;
        const value = mainProperty ? apiEvent[id] : dataValuesById[id];
        const clientValue = isStatus
            ? convertServerStatusToClient(value, apiEvent.scheduledAt)
            : convertServerToClient(value, type);

        const urls = (type === dataElementTypes.IMAGE) ?
            (() => (featureAvailable(FEATURES.trackerImageEndpoint) ?
                {
                    imageUrl: `/tracker/events/${apiEvent.event}/dataValues/${id}/image`,
                    previewUrl: `/tracker/events/${apiEvent.event}/dataValues/${id}/image?dimension=small`,
                } : {
                    imageUrl: `/events/files?dataElementUid=${id}&eventUid=${apiEvent.event}`,
                    previewUrl: `/events/files?dataElementUid=${id}&eventUid=${apiEvent.event}&dimension=SMALL`,
                }
            ))() : {};

        return {
            id: getFilterClientName(id),
            value: clientValue,
            ...urls,
        };
    });

export const convertToClientEvents = (
    apiEvents: ApiEvents,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
): ClientEvents =>
    apiEvents.map((apiEvent) => {
        const dataValuesById = getDataValuesById(apiEvent.dataValues);
        const attributeValuesById = getAttributeById(apiEvent.parent?.attributes);
        const apiTEI = apiEvent.parent;
        const eventRecord = buildEventRecord({
            columnsMetaForDataFetching,
            apiEvent,
            dataValuesById,
        });
        const TEIRecord = apiTEI
            ? buildTEIRecord({
                columnsMetaForDataFetching,
                apiTEI,
                attributeValuesById,
                trackedEntity: apiEvent.trackedEntity,
                programId: apiEvent.program,
            })
            : [];

        const record = [
            ...eventRecord,
            ...TEIRecord,
        ]
            .filter(({ value }) => value != null)
            .reduce((acc, { id, value, imageUrl, previewUrl }: any) => {
                acc[id] = {
                    convertedValue: value,
                    ...(imageUrl ? { imageUrl, previewUrl } : {}),
                };
                return acc;
            }, {});

        return {
            id: apiEvent.event,
            record,
        };
    });
