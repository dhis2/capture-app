// @flow
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { convertValue as convertClientToView } from '../../../../converters/clientToView';
import { convertValue as convertServerToClient } from '../../../../converters/serverToClient';
import { statusTypes, dataElementTypes } from '../../../../metaData';

export const DEFAULT_NUMBER_OF_ROW = 5;

export const isEventOverdue = (event: ApiTEIEvent) => moment(event.dueDate).isSameOrBefore(new Date())
    && event.status === statusTypes.SCHEDULE;

const getEventStatus = (event: ApiTEIEvent) => {
    if (isEventOverdue(event)) {
        return { value: statusTypes.OVERDUE };
    }
    if (event.status === statusTypes.SCHEDULE) {
        return { value: statusTypes.SCHEDULE, options: moment(event.eventDate).from(new Date()) };
    }
    return { value: event.status };
};

export const getValueByKeyFromEvent = (event: ApiTEIEvent, type: string) => {
    switch (type) {
    case 'status':
        return getEventStatus(event);
    default:
        return event[type];
    }
};

export const formatValueForView = (data: any, type: $Keys<typeof dataElementTypes>) =>
    convertClientToView(convertServerToClient(data, type), type);

export const sortDataFromEvent = (strA: any, strB: any, direction: string) => {
    if (direction === 'asc') {
        return strA < strB ? -1 : 1;
    }

    if (direction === 'desc') {
        return strA < strB ? 1 : -1;
    }

    return 0;
};

export const computeDataFromEvent = (data: any, events: Array<ApiTEIEvent>) => {
    const dataSource = events.reduce((acc, currentEvent) => {
        const keys = [
            { id: 'status', type: dataElementTypes.STATUS },
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
                value: formatValueForView(getValueByKeyFromEvent(currentEvent, key.id), key.type),
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
