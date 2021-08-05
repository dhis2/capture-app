// @flow
import React from 'react';
import moment from 'moment';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { Tag } from '@dhis2/ui';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { convertValue as convertClientToList } from '../../../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../../../converters/serverToClient';
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

const mergeRecordsByType = async (events: Array<ApiTEIEvent>, dataElements: Array<StageDataElement>) => {
    // $FlowFixMe
    const dataElementsByType = events.reduce((acc, event) => {
        event.dataValues.forEach((dataValue) => {
            const { dataElement: id, value } = dataValue;
            const { type } = dataElements.find(el => el.id === id) || {};
            if (!type) {
                return;
            }
            const currentItem = acc.find(item => item.type === type);
            if (!currentItem) {
                acc.push({ type, ids: { [id]: value } });
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

const getAllFieldsWithValue = (
    dataElements: Array<StageDataElement>,
    dataElementsByType: Array<{type: string, ids: Object}>,
) => dataElements
    .reduce((acc, { id, type, options }) => {
        const value = dataElementsByType.find(item => item.type === type)?.ids?.[id];
        if (type && value) {
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


export {
    isEventOverdue,
    getEventStatus,
    getAllFieldsWithValue,
    convertStatusForView,
    getValueByKeyFromEvent,
    formatValueForView,
    mergeRecordsByType,
};
