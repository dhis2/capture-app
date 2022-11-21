// @flow
import moment from 'moment';
import { statusTypes, translatedStatusTypes } from 'capture-core/events/statusTypes';
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

const isEventOverdue = (status: string, scheduledAt: string) =>
    moment(scheduledAt).isBefore(moment().startOf('day')) && status === statusTypes.SCHEDULE;

const convertServerStatusToClient = (value: string, scheduledAt: string) => {
    const translatedStatus = translatedStatusTypes();
    if (isEventOverdue(value, scheduledAt)) {
        return translatedStatus.OVERDUE;
    }
    return translatedStatus[value];
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
}: {
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    apiTEI: ApiTei,
    attributeValuesById: Object,
    trackedEntity: string,
}) =>
    columnsMetaForDataFetching.map(({ id, mainProperty, type }) => {
        const value = mainProperty ? apiTEI[id] : attributeValuesById[id];
        return {
            id,
            value: convertServerToClient(value, type),
            urlPath: `/trackedEntityInstances/${trackedEntity}/${id}/image`,
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

        return {
            id: getFilterClientName(id),
            value: clientValue,
            urlPath: `/events/files?dataElementUid=${id}&eventUid=${apiEvent.event}`,
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
            })
            : [];

        const record = [
            ...eventRecord,
            ...TEIRecord,
        ]
            .filter(({ value }) => value != null)
            .reduce((acc, { id, value, urlPath }) => {
                acc[id] = { convertedValue: value, urlPath };
                return acc;
            }, {});

        return {
            id: apiEvent.event,
            record,
        };
    });
