// @flow
import React from 'react';
import moment from 'moment';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { Tag } from '@dhis2/ui';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { convertValue as convertClientToList } from '../../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../../converters/serverToClient';
import { statusTypes, translatedStatusTypes } from '../../../../../metaData';
import { getSubValues } from '../getEventDataWithSubValue';
import type { StageDataElement } from '../../../types/common.types';

const isEventOverdue = (event: ApiTEIEvent) => moment(event.dueDate).isSameOrBefore(new Date())
    && event.status === statusTypes.SCHEDULE;

const getEventStatus = (event: ApiTEIEvent) => {
    if (isEventOverdue(event)) {
        return { status: statusTypes.OVERDUE, options: undefined };
    }
    if (event.status === statusTypes.SCHEDULE) {
        return { status: statusTypes.SCHEDULE, options: moment(event.eventDate).from(new Date()) };
    }
    return { status: event.status, options: undefined };
};

const getValueByKeyFromEvent = (event: ApiTEIEvent, { id, resolveValue }: Object) => {
    if (resolveValue) {
        return resolveValue(event);
    }

    return event[id];
};

const formatValueForView = (dataElements: Array<StageDataElement>, type: string) =>
// $FlowFixMe
    convertClientToList(convertServerToClient(dataElements, type), type);


const convertStatusForView = (event: ApiTEIEvent) => {
    const { status, options } = getEventStatus(event);
    const isPositive = [statusTypes.COMPLETED].includes(status);
    const isNegative = [statusTypes.OVERDUE].includes(status);

    return (
        <Tag negative={isNegative} positive={isPositive}>
            {translatedStatusTypes(options)[status]}
        </Tag>
    );
};

const convertEventsToObject = (events: Array<ApiTEIEvent>) => events.reduce((acc, event) => {
    const { event: eventId, dataValues } = event;
    const records = dataValues.reduce((accData, dataValue) => {
        const { dataElement, value } = dataValue;
        accData[dataElement] = value;
        return accData;
    }, {});
    acc.push({ id: eventId, records, event });
    return acc;
}, []);

const groupDataElementsByType = async (eventId, dataElements: Array<StageDataElement>, records: Object) => {
    // $FlowFixMe
    const dataElementsByType = dataElements.reduce((acc, dataElement) => {
        const { id, type } = dataElement;
        const value = records[id];

        const currentItem = acc.find(item => item.type === dataElement.type);
        if (!currentItem) {
            acc.push({ type, ids: { [id]: value } });
        } else {
            currentItem.ids[id] = value;
        }
        return acc;
    }, []);

    for await (const item of dataElementsByType) {
        item.ids = await getSubValues(eventId, item.type, item.ids);
    }
    return dataElementsByType;
};

const getAllFieldsWithValue = async (
    dataElements: Array<StageDataElement>,
    eventId: string,
    columns: Array<{id: string, isPredefined?: boolean }>,
    records: Object,
) => {
    const dataElementsByType = await groupDataElementsByType(eventId, dataElements, records);
    return columns
        .filter(({ isPredefined }) => !isPredefined)
        .reduce((acc, { id }) => {
            const { type, options } = dataElements.find(el => el.id === id) ?? {};
            if (type && records[id]) {
                const value = dataElementsByType.find(item => item.type === type).ids[id];
                if (options) {
                    if (options[value]) {
                        acc[id] = options[value];
                    } else {
                        log.error(
                            errorCreator(
                                'Missing value in options')(
                                { id, value, options }),
                        );
                        acc[id] = formatValueForView(value, type);
                    }
                } else {
                    acc[id] = formatValueForView(value, type);
                }
            } else {
                acc[id] = undefined;
            }
            return acc;
        }, {});
};


export {
    isEventOverdue,
    getEventStatus,
    getAllFieldsWithValue,
    convertEventsToObject,
    convertStatusForView,
    getValueByKeyFromEvent,
    formatValueForView,
};
