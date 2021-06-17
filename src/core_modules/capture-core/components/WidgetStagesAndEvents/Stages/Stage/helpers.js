// @flow
import React, { useMemo } from 'react';
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


export const useComputeDataFromEvent = (data: any, events: Array<ApiTEIEvent>, headerColumns: Array<{id: string}>) => {
    const dataSource = useMemo(() => events.reduce((acc, currentEvent) => {
        const defaultKeys = [
            { id: 'status', resolveValue: convertStatusForView },
            { id: 'eventDate', type: dataElementTypes.DATE },
            { id: 'orgUnitName', type: dataElementTypes.TEXT }];
        const arr = [...defaultKeys, ...currentEvent.dataValues.map((item) => {
            const { valueType } = data?.find(el => el.dataElement.id === item.dataElement)?.dataElement || {};
            return {
                id: item.dataElement,
                type: valueType,
                value: item.value,
            };
        })];

        const row = headerColumns.map(({ id }) => {
            const { type, value, resolveValue } = (arr.find(i => i.id === id)) || {};
            let displayValue;
            if (value === undefined) {
                displayValue = formatValueForView(getValueByKeyFromEvent(currentEvent, { id, resolveValue }), type);
            } else {
                displayValue = formatValueForView(value, type);
            }
            return { id, value: displayValue };
        });
        acc.push(row);
        return acc;
    }, []), [events, data, headerColumns]);
    return dataSource || [];
};

export const useComputeHeaderColumn = (data: any, events: Array<ApiTEIEvent>) => {
    const headerColumns = useMemo(() => {
        const defaultColumns = [
            { id: 'status', header: i18n.t('Status'), sortDirection: 'default' },
            { id: 'eventDate', header: i18n.t('Report date'), sortDirection: 'default' },
            { id: 'orgUnitName', header: i18n.t('Registering unit'), sortDirection: 'default',
            }];
        const dataElementHeaders = events.reduce((acc, currEvent) => {
            currEvent.dataValues.forEach((dataValue) => {
                const { dataElement: id } = dataValue;
                const { dataElement } = data?.find(el => el.dataElement.id === id) ?? {};

                if (!acc.find(item => item.id === dataValue.dataElement)) {
                    acc.push({ id, header: dataElement?.displayName, sortDirection: 'default' });
                }
            });
            return acc;
        }, []);
        return [...defaultColumns, ...dataElementHeaders];
    }, [data, events]);


    return headerColumns;
};
