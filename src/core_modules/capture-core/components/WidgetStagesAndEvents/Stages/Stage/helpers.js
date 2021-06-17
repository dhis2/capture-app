// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { Tag } from '@dhis2/ui';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { convertValue as convertClientToList } from '../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../converters/serverToClient';
import { statusTypes, dataElementTypes, translatedStatusTypes } from '../../../../metaData';

export const DEFAULT_NUMBER_OF_ROW = 5;

export const isEventOverdue = (event: ApiTEIEvent) => moment(event.dueDate).isSameOrBefore(new Date())
    && event.status === statusTypes.SCHEDULE;

const getEventStatus = (event: ApiTEIEvent) => {
    if (isEventOverdue(event)) {
        return { status: statusTypes.OVERDUE };
    }
    if (event.status === statusTypes.SCHEDULE) {
        return { status: statusTypes.SCHEDULE, options: moment(event.eventDate).from(new Date()) };
    }
    return { status: event.status };
};

export const getValueByKeyFromEvent = (event: ApiTEIEvent, { id, resolveValue }: Object) => {
    if (resolveValue) {
        return resolveValue(event);
    }

    return event[id];
};

export const formatValueForView = (data: any, type: $Keys<typeof dataElementTypes>) =>
    convertClientToList(convertServerToClient(data, type), type);

export const sortDataFromEvent = (strA: any, strB: any, direction: string) => {
    if (direction === 'asc') {
        return strA < strB ? -1 : 1;
    }

    if (direction === 'desc') {
        return strA < strB ? 1 : -1;
    }

    return 0;
};

function convertStatusForView(event: ApiTEIEvent) {
    const { status, options } = getEventStatus(event);
    const isPositive = [statusTypes.COMPLETED].includes(status);
    const isNegative = [statusTypes.OVERDUE].includes(status);

    return (
        <Tag negative={isNegative} positive={isPositive}>
            {translatedStatusTypes(options)[status]}
        </Tag>
    );
}

export const computeDataFromEvent = (data: any, events: Array<ApiTEIEvent>) => {
    const dataSource = events.reduce((acc, currentEvent) => {
        const keys = [
            { id: 'status', type: dataElementTypes.STATUS, resolveValue: convertStatusForView },
            { id: 'eventDate', type: dataElementTypes.DATE },
            { id: 'orgUnitName', type: dataElementTypes.TEXT }];
        const dataElementsInEvent = currentEvent.dataValues
            .map(item => ({ id: item.dataElement,
                value: formatValueForView(item.value,
                    data?.find(el => el.dataElement.id === item.dataElement)?.valueType),
            }));

        acc.push([
            ...keys.map(key => ({
                id: key.id,
                value: formatValueForView(getValueByKeyFromEvent(currentEvent, key), key.type),
            })),
            ...dataElementsInEvent]);
        return acc;
    }, []);

    return dataSource || [];
};

export const computeHeaderColumn = (data: any, events: Array<ApiTEIEvent>) => {
    const defaultColumns = [
        { id: 'status', header: i18n.t('Status'), sortDirection: 'default' },
        { id: 'eventDate', header: i18n.t('Report date'), sortDirection: 'default' },
        { id: 'orgUnitName', header: i18n.t('Registering unit'), sortDirection: 'default',
        }];

    const dataElementHeaders = events[0].dataValues.map((item) => {
        const { dataElement } = data?.find(el => el.dataElement.id === item.dataElement) ?? {};
        return { id: item.dataElement, header: dataElement?.displayName, sortDirection: 'default' };
    });
    return [...defaultColumns, ...dataElementHeaders];
};
