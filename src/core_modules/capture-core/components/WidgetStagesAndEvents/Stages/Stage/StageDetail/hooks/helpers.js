// @flow
import React from 'react';
import moment from 'moment';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { statusTypes, translatedStatusTypes } from '../../../../../../metaData';
import { convertMomentToDateFormatString } from '../../../../../../utils/converters/date';
import { getSubValues } from '../../getEventDataWithSubValue';
import type { StageDataElement } from '../../../../types/common.types';
import { Comments } from '../Comments.component';

const isEventOverdue = (event: ApiTEIEvent) => moment(event.dueDate).isSameOrBefore(new Date())
    && event.status === statusTypes.SCHEDULE;

const getEventStatus = (event: ApiTEIEvent) => {
    const today = moment().startOf('day');
    const dueDate = moment(event.dueDate);
    const dueDateFromNow = dueDate.from(today);
    const daysUntilDueDate = dueDate.diff(today, 'days');

    if (isEventOverdue(event)) {
        return { status: statusTypes.OVERDUE, options: daysUntilDueDate ? dueDateFromNow : undefined };
    }

    if (event.status === statusTypes.SCHEDULE) {
        if (!event.dueDate || !daysUntilDueDate) {
            return { status: statusTypes.SCHEDULE, options: undefined };
        }

        if (daysUntilDueDate < 14) {
            return { status: statusTypes.SCHEDULE, options: dueDateFromNow };
        }
        return { status: statusTypes.SCHEDULE, options: convertMomentToDateFormatString(dueDate) };
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
    return {
        isNegative,
        isPositive,
        text: translatedStatusTypes(options)[status],
        status,
    };
};

const convertCommentForView = (event: ApiTEIEvent) => <Comments event={event} />;

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
    convertCommentForView,
    getValueByKeyFromEvent,
    groupRecordsByType,
};
