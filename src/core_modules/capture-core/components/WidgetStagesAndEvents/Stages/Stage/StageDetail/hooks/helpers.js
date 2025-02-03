// @flow
import React from 'react';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import { statusTypes, translatedStatusTypes } from 'capture-core/events/statusTypes';
import { convertIsoToLocalCalendar } from '../../../../../../utils/converters/date';
import { getSubValues } from '../../getEventDataWithSubValue';
import type { StageDataElementClient } from '../../../../types/common.types';
import { Notes } from '../Notes.component';
import type { QuerySingleResource } from '../../../../../../utils/api/api.types';
import { isEventOverdue } from '../../../../../../utils/isEventOverdue';

const getEventStatus = (event: ApiEnrollmentEvent) => {
    const today = moment().startOf('day');
    const dueDate = moment(event.scheduledAt);
    const dueDateFromNow = dueDate.from(today);
    const daysUntilDueDate = dueDate.diff(today, 'days');

    if (isEventOverdue(event)) {
        return { status: statusTypes.OVERDUE, options: daysUntilDueDate ? dueDateFromNow : undefined };
    }
    // DHIS2-11576: VISITED status is treated as ACTIVE
    if (event.status === 'VISITED') {
        return { status: statusTypes.ACTIVE, options: undefined };
    }

    if (event.status === statusTypes.SCHEDULE) {
        if (!event.scheduledAt) {
            return { status: statusTypes.SCHEDULE, options: undefined };
        }

        if (daysUntilDueDate === 0) {
            return { status: statusTypes.SCHEDULE, options: i18n.t('Today') };
        }

        if (daysUntilDueDate < 14) {
            return { status: statusTypes.SCHEDULE, options: dueDateFromNow };
        }
        return { status: statusTypes.SCHEDULE, options: convertIsoToLocalCalendar(event.scheduledAt) };
    }
    return { status: event.status, options: undefined };
};

const getValueByKeyFromEvent = (event: ApiEnrollmentEvent, { id, resolveValue }: Object) => {
    if (resolveValue) {
        return resolveValue(event);
    }

    return event[id];
};


const convertStatusForView = (event: ApiEnrollmentEvent) => {
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


const convertNoteForView = (event: ApiEnrollmentEvent) => <Notes event={event} />;

const groupRecordsByType = async (
    events: Array<ApiEnrollmentEvent>,
    dataElements: Array<StageDataElementClient>,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
) => {
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
    // $FlowFixMe
    for await (const item of dataElementsByType) {
        item.ids = await getSubValues(item, querySingleResource, absoluteApiPath);
    }
    return dataElementsByType;
};


export {
    isEventOverdue,
    getEventStatus,
    convertStatusForView,
    convertNoteForView,
    getValueByKeyFromEvent,
    groupRecordsByType,
};
