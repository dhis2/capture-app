// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { dataElementTypes } from '../../../../../metaData';
import type { StageDataElement } from '../../types/common.types';
import {
    convertStatusForView,
    convertEventsToObject,
    getAllFieldsWithValue,
    getValueByKeyFromEvent,
    formatValueForView } from './helpers';

const useComputeDataFromEvent =
    (
        dataElements: Array<StageDataElement>,
        events: Array<ApiTEIEvent>,
        headerColumns: Array<{id: string, isPredefined?: boolean}>,
    ) => {
        const [dataSource, setDataSource] = React.useState([]);
        const eventsObject = convertEventsToObject(events);
        const computeData = async () => {
            const eventsData = [];
            // $FlowFixMe
            for await (const eventObject of eventsObject) {
                const { id: eventId, records, event } = eventObject;
                const predefinedFields = [
                    { id: 'status', type: dataElementTypes.UNKNOWN, resolveValue: convertStatusForView },
                    { id: 'eventDate', type: dataElementTypes.DATE },
                    { id: 'orgUnitName', type: dataElementTypes.TEXT }].map(field => ({
                    ...field,
                    value: formatValueForView(getValueByKeyFromEvent(event, field), field.type),
                }));
                const allFields = await getAllFieldsWithValue(dataElements, eventId, headerColumns, records);

                eventsData.push([...predefinedFields, ...allFields]);
            }
            setDataSource(eventsData);
        };

        return { computeData, dataSource };
    };

const useComputeHeaderColumn = (dataElements: Array<StageDataElement>, events: Array<ApiTEIEvent>) => {
    const headerColumns = useMemo(() => {
        const defaultColumns = [
            { id: 'status', header: i18n.t('Status'), sortDirection: 'default', isPredefined: true },
            { id: 'eventDate', header: i18n.t('Report date'), sortDirection: 'default', isPredefined: true },
            { id: 'orgUnitName', header: i18n.t('Registering unit'), sortDirection: 'default', isPredefined: true,
            }];
        const dataElementHeaders = dataElements.reduce((acc, currDataElement) => {
            const { id, name } = currDataElement;
            const eventDataElement = events.find(event => event.dataValues.find(el => el.dataElement === id));
            if (eventDataElement && !acc.find(item => item.id === id)) {
                acc.push({ id, header: name, sortDirection: 'default' });
            }
            return acc;
        }, []);
        return [...defaultColumns, ...dataElementHeaders];
    }, [dataElements, events]);


    return headerColumns;
};

export {
    useComputeDataFromEvent,
    useComputeHeaderColumn,
};
