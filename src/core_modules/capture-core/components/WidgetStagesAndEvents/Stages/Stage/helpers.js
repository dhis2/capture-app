// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { Tag } from '@dhis2/ui';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { apiDataElement } from 'capture-core/metaDataStoreLoaders/programs/quickStoreOperations/types';
import { convertValue as convertClientToList } from '../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../converters/serverToClient';
import { statusTypes, dataElementTypes, translatedStatusTypes } from '../../../../metaData';

export const DEFAULT_NUMBER_OF_ROW = 5;

export const isEventOverdue = (event: ApiTEIEvent) => moment(event.dueDate).isSameOrBefore(new Date())
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

export const getValueByKeyFromEvent = (event: ApiTEIEvent, { id, resolveValue }: Object) => {
    if (resolveValue) {
        return resolveValue(event);
    }

    return event[id];
};

export const formatValueForView = (data: Array<apiDataElement>, type: string) =>
// $FlowFixMe
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


export const useComputeDataFromEvent =
    (data: Array<apiDataElement>, events: Array<ApiTEIEvent>, headerColumns: Array<{id: string}>) => {
        const dataSource = useMemo(() => events.reduce((acc, currentEvent) => {
            const predefinedFields = [
                { id: 'status', type: dataElementTypes.UNKNOWN, resolveValue: convertStatusForView },
                { id: 'eventDate', type: dataElementTypes.DATE },
                { id: 'orgUnitName', type: dataElementTypes.TEXT }].map(field => ({
                ...field,
                value: formatValueForView(getValueByKeyFromEvent(currentEvent, field), field.type),
            }));

            const otherFields = currentEvent.dataValues.map((item) => {
                const { valueType } = data?.find(el => el.id === item.dataElement) || {};
                return {
                    id: item.dataElement,
                    type: valueType,
                    value: formatValueForView(item.value, valueType),
                };
            });
            const allFields = [...predefinedFields, ...otherFields];

            // $FlowFixMe
            const row = headerColumns.map((col) => {
                const fields = allFields.find(f => f.id === col.id);
                if (fields) {
                    return { ...fields };
                }
                return { id: col.id };
            });

            acc.push(row);
            return acc;
        }, []), [events, data, headerColumns]);
        return dataSource || [];
    };

export const useComputeHeaderColumn = (data: Array<apiDataElement>, events: Array<ApiTEIEvent>) => {
    const headerColumns = useMemo(() => {
        const defaultColumns = [
            { id: 'status', header: i18n.t('Status'), sortDirection: 'default' },
            { id: 'eventDate', header: i18n.t('Report date'), sortDirection: 'default' },
            { id: 'orgUnitName', header: i18n.t('Registering unit'), sortDirection: 'default',
            }];
        const dataElementHeaders = events.reduce((acc, currEvent) => {
            currEvent.dataValues.forEach((dataValue) => {
                const { dataElement: id } = dataValue;
                const { displayName } = data?.find(el => el.id === id) ?? {};

                if (!acc.find(item => item.id === dataValue.dataElement)) {
                    acc.push({ id, header: displayName, sortDirection: 'default' });
                }
            });
            return acc;
        }, []);
        return [...defaultColumns, ...dataElementHeaders];
    }, [data, events]);


    return headerColumns;
};
