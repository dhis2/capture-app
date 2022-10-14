// @flow
import { convertServerToClient } from '../../../../../../../converters';
import type {
    ApiEvents,
    ApiEvent,
    ApiTeiAttributes,
    ApiDataElement,
    TeiColumnsMetaForDataFetchingArray,
    ClientEvents,
} from './types';

const getAttributeById = (attributeValues?: ApiTeiAttributes = []) =>
    attributeValues.reduce((acc, { attribute, value }) => {
        acc[attribute] = value;
        return acc;
    }, {});

const getDataValuesById = (dataValues?: ApiDataElement = []) =>
    dataValues.reduce((acc, { dataElement, value }) => {
        acc[dataElement] = value;
        return acc;
    }, {});

const buildRecord = ({
    columnsMetaForDataFetching,
    event,
    elementsById,
    eventId,
    trackedEntity,
    isDataElement,
}: {
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    event: ApiEvent,
    elementsById: Object,
    eventId: string,
    trackedEntity: string,
    isDataElement?: boolean,
}) =>
    columnsMetaForDataFetching.map(({ id, mainProperty, type }) => {
        const value = mainProperty ? event[id] : elementsById[id];
        return {
            id,
            value: convertServerToClient(value, type),
            urlPath: isDataElement
                ? `/events/files?dataElementUid=${id}&eventUid=${eventId}`
                : `/trackedEntityInstances/${trackedEntity}/${id}/image`,
        };
    });

export const convertToClientEvents = (
    apiEvents: ApiEvents,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
): ClientEvents =>
    apiEvents.map((event) => {
        const dataValuesById = getDataValuesById(event.dataValues);
        const attributeValuesById = getAttributeById(event.parent?.attributes);
        const eventId = event.event;
        const trackedEntity = event.trackedEntity;

        const record = [
            ...buildRecord({
                columnsMetaForDataFetching,
                event,
                elementsById: dataValuesById,
                eventId,
                trackedEntity,
                isDataElement: true,
            }),
            ...buildRecord({
                columnsMetaForDataFetching,
                event,
                elementsById: attributeValuesById,
                eventId,
                trackedEntity,
            }),
        ]
            .filter(({ value }) => value != null)
            .reduce((acc, { id, value, urlPath }) => {
                acc[id] = { convertedValue: value, urlPath };
                return acc;
            }, {});

        return {
            id: eventId,
            record,
        };
    });
