// @flow
import React from 'react';
import moment from 'moment';
import { Tag } from '@dhis2/ui';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { statusTypes, translatedStatusTypes } from '../../../../../../metaData';
import { getSubValues } from '../../getEventDataWithSubValue';
import type { StageDataElement } from '../../../../types/common.types';

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

const groupRecordsByType = async (events: Array<ApiTEIEvent>, dataElements: Array<StageDataElement>) => {
    // $FlowFixMe
    const dataElementsByType = events.reduce((acc, event) => {
        event.dataValues.forEach((dataValue) => {
            const { dataElement: id, value } = dataValue;
            const { type } = dataElements.find(el => el.id === id) || {};
            if (!type) { return; }
            const currentItem = acc.find(item => item.type === type && item.eventId === event.event);
            if (!currentItem) {
                acc.push({ type, eventId: event.event, ids: { [id]: value } });
            } else {
                currentItem.ids[id] = value;
            }
        });
        return acc;
    }, []);

    for await (const item of dataElementsByType) {
        item.ids = await getSubValues(item.type, item.ids);
    }
    return dataElementsByType;
};


export {
    isEventOverdue,
    getEventStatus,
    convertStatusForView,
    getValueByKeyFromEvent,
    groupRecordsByType,
};
