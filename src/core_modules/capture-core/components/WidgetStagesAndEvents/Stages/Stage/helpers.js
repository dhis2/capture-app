// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { Tag } from '@dhis2/ui';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { convertValue as convertClientToList } from '../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../converters/serverToClient';
import { statusTypes, dataElementTypes, translatedStatusTypes } from '../../../../metaData';
import { getSubValues } from './getEventDataWithSubValue';
import type { StageDataElement } from '../../types/common.types';

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

export const formatValueForView = (dataElements: Array<StageDataElement>, type: string) =>
// $FlowFixMe
    convertClientToList(convertServerToClient(dataElements, type), type);


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
    (dataElements: Array<StageDataElement>, events: Array<ApiTEIEvent>, headerColumns: Array<{id: string}>) => {
        const [dataSource, setDataSource] = React.useState([]);

        const computeData = async () => {
            const eventsData = [];
            // $FlowFixMe
            for await (const event of events) {
                const { event: eventId, dataValues } = event;
                const predefinedFields = [
                    { id: 'status', type: dataElementTypes.UNKNOWN, resolveValue: convertStatusForView },
                    { id: 'eventDate', type: dataElementTypes.DATE },
                    { id: 'orgUnitName', type: dataElementTypes.TEXT }].map(field => ({
                    ...field,
                    value: formatValueForView(getValueByKeyFromEvent(event, field), field.type),
                }));
                const allFields = await Promise.all(headerColumns.map(async (col) => {
                    const prefinedField = predefinedFields.find(f => f.id === col.id);
                    if (prefinedField) { return prefinedField; }
                    const { dataElement: metaElementId, value } = dataValues.find(i => i.dataElement === col.id) ?? {};
                    const { type } = dataElements.find(el => el.id === metaElementId) ?? {};
                    if (type) {
                        // $FlowFixMe
                        const subValue = await getSubValues(
                            eventId, type, { [metaElementId]: value },
                        );
                        return {
                            id: metaElementId,
                            type,
                            value: formatValueForView(subValue[metaElementId], type),
                        };
                    }
                    return { id: col.id, value: undefined };
                }));

                eventsData.push(allFields);
            }
            setDataSource(eventsData);
        };

        return { computeData, dataSource };
    };

export const useComputeHeaderColumn = (dataElements: Array<StageDataElement>, events: Array<ApiTEIEvent>) => {
    const headerColumns = useMemo(() => {
        const defaultColumns = [
            { id: 'status', header: i18n.t('Status'), sortDirection: 'default' },
            { id: 'eventDate', header: i18n.t('Report date'), sortDirection: 'default' },
            { id: 'orgUnitName', header: i18n.t('Registering unit'), sortDirection: 'default',
            }];
        const dataElementHeaders = events.reduce((acc, currEvent) => {
            currEvent.dataValues.forEach((dataValue) => {
                const { dataElement: id } = dataValue;
                const dataInStage = dataElements.find(el => el.id === id);
                if (dataInStage) {
                    if (!acc.find(item => item.id === dataValue.dataElement)) {
                        acc.push({ id, header: dataInStage.name, sortDirection: 'default' });
                    }
                }
            });
            return acc;
        }, []);
        return [...defaultColumns, ...dataElementHeaders];
    }, [dataElements, events]);


    return headerColumns;
};
