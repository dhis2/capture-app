// @flow
import { useMemo, useState, useEffect, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../../../metaData';
import type { StageDataElement } from '../../../../types/common.types';
import { convertValue as convertClientToList } from '../../../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../../../converters/serverToClient';
import {
    convertStatusForView,
    convertCommentForView,
    getValueByKeyFromEvent,
    groupRecordsByType,
} from './helpers';
import { SORT_DIRECTION } from './constants';

const baseKeys = [{ id: 'status' }, { id: 'occurredAt' }, { id: 'orgUnitName' }, { id: 'scheduledAt' }, { id: 'comments' }];
const basedFieldTypes = [
    { type: dataElementTypes.STATUS, resolveValue: convertStatusForView },
    { type: dataElementTypes.DATE },
    { type: dataElementTypes.TEXT },
    { type: dataElementTypes.DATE },
    { type: dataElementTypes.UNKNOWN, resolveValue: convertCommentForView },
];
const baseColumnHeaders = [
    { header: i18n.t('Status'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: i18n.t('Report date'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: i18n.t('Registering unit'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    {
        header: i18n.t('Due date'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true,
    },
    { header: '', sortDirection: null, isPredefined: true },
];

const baseFields = baseKeys.map((key, index) => ({ ...key, ...basedFieldTypes[index] }));
// $FlowFixMe
const baseColumns = baseFields.map((key, index) => ({ ...key, ...baseColumnHeaders[index] }));

const getAllFieldsWithValue = (
    eventId: string,
    dataElements: Array<StageDataElement>,
    dataElementsByType: Array<{type: string, eventId: string, ids: Object}>,
) => dataElements
    .reduce((acc, { id, type, options }) => {
        const value = dataElementsByType
            .find(item => item.type === type && item.eventId === eventId)?.ids?.[id];
        if (type && value) {
            if (options) {
                if (options[value]) {
                    acc[id] = options[value];
                } else {
                    log.error(
                        errorCreator('Missing value in options')({ id, value, options }),
                    );
                    acc[id] = convertServerToClient(value, type);
                }
            } else {
                acc[id] = convertServerToClient(value, type);
            }
        } else {
            acc[id] = undefined;
        }
        return acc;
    }, {});

const useComputeDataFromEvent = (dataElements: Array<StageDataElement>, events: Array<ApiEnrollmentEvent>) => {
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const dataEngine = useDataEngine();
    const computeData = useCallback(async () => {
        try {
            setLoading(true);
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const dataElementsByType = await groupRecordsByType(events, dataElements, querySingleResource);
            const eventsData = [];
            for (const event of events) {
                const eventId = event.event;
                const predefinedFields = baseFields.reduce((acc, field) => {
                    acc[field.id] = convertServerToClient(getValueByKeyFromEvent(event, field), field.type);
                    return acc;
                }, {});

                const allFields = getAllFieldsWithValue(eventId, dataElements, dataElementsByType);
                eventsData.push({
                    id: eventId,
                    pendingApiResponse: event.pendingApiResponse,
                    ...predefinedFields,
                    ...allFields,
                });
            }
            setValue(eventsData);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [events, dataElements, dataEngine]);

    useEffect(() => {
        computeData();
    }, [computeData]);

    return { value, error, loading };
};

const useComputeHeaderColumn = (dataElements: Array<StageDataElement>, hideDueDate: boolean) => {
    const headerColumns = useMemo(() => {
        const dataElementHeaders = dataElements.reduce((acc, currDataElement) => {
            const { id, name, type } = currDataElement;
            if (!acc.find(item => item.id === id)) {
                acc.push({ id, header: name, type, sortDirection: SORT_DIRECTION.DEFAULT });
            }
            return acc;
        }, []);
        return [
            ...baseColumns.filter(col => (hideDueDate ? col.id !== 'scheduledAt' : true)),
            ...dataElementHeaders];
    }, [dataElements, hideDueDate]);

    return headerColumns;
};

const formatRowForView = (row: Object, dataElements: Array<StageDataElement>) => Object.keys(row).reduce((acc, id) => {
    const { type: predefinedType } = baseFields.find(f => f.id === id) || {};
    const { type } = dataElements.find(el => el.id === id) || {};
    const value = row[id];
    if (predefinedType) {
        acc[id] = convertClientToList(value, predefinedType);
    } else if (!type) {
        acc[id] = value;
    } else {
        acc[id] = convertClientToList(value, type);
    }
    return acc;
}, {});


export {
    useComputeDataFromEvent,
    useComputeHeaderColumn,
    formatRowForView,
};
