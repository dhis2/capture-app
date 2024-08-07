// @flow
import { useMemo, useState, useEffect, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { useDataEngine, useConfig } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { errorCreator, buildUrl } from 'capture-core-utils';
import { dataElementTypes, DataElement, OptionSet, Option } from '../../../../../../metaData';
import type { StageDataElement } from '../../../../types/common.types';
import { convertValue as convertClientToList } from '../../../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../../../converters/serverToClient';
import {
    convertStatusForView,
    convertOrgUnitForView,
    convertNoteForView,
    getValueByKeyFromEvent,
    groupRecordsByType,
} from './helpers';
import { SORT_DIRECTION, MULIT_TEXT_WITH_NO_OPTIONS_SET } from './constants';
import {
    isMultiTextWithoutOptionset,
} from '../../../../../../metaDataMemoryStoreBuilders/common/helpers/dataElement/unsupportedMultiText';
import { useOrgUnitNames } from '../../../../../../metadataRetrieval/orgUnitName';

const baseKeys = [{ id: 'status' }, { id: 'occurredAt' }, { id: 'assignedUser' }, { id: 'orgUnitName' }, { id: 'scheduledAt' }, { id: 'notes' }];
const basedFieldTypes = [
    { type: dataElementTypes.STATUS, resolveValue: convertStatusForView },
    { type: dataElementTypes.DATE },
    { type: 'ASSIGNEE' },
    { type: dataElementTypes.TEXT, resolveValue: convertOrgUnitForView },
    { type: dataElementTypes.DATE },
    { type: dataElementTypes.UNKNOWN, resolveValue: convertNoteForView },
];
const getBaseColumnHeaders = props => [
    { header: i18n.t('Status'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: props.formFoundation.getLabel('occurredAt'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: i18n.t('Assigned to'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: i18n.t('Organisation unit'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: props.formFoundation.getLabel('scheduledAt'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: '', sortDirection: null, isPredefined: true },
];

const baseFields = baseKeys.map((key, index) => ({ ...key, ...basedFieldTypes[index] }));
// $FlowFixMe
const getBaseColumns = props => baseFields.map((key, index) => ({ ...key, ...getBaseColumnHeaders(props)[index] }));

const getAllFieldsWithValue = (
    eventId: string,
    dataElements: Array<StageDataElement>,
    dataElementsByType: Array<{type: string, eventId: string, ids: Object}>,
) => dataElements
    .reduce((acc, { id, type }) => {
        const value = dataElementsByType
            .find(item => item.type === type && item.eventId === eventId)?.ids?.[id];
        if (type && value) {
            acc[id] = convertServerToClient(value, type);
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
    const { baseUrl, apiVersion } = useConfig();
    const orgUnits = useMemo(() => events.map(({ orgUnit }) => orgUnit), [events]);
    const { orgUnitNames, error: orgUnitNamesError } = useOrgUnitNames(orgUnits);
    const computeData = useCallback(async () => {
        try {
            setLoading(true);
            const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
            const absoluteApiPath = buildUrl(baseUrl, `api/${apiVersion}`);
            const dataElementsByType =
                await groupRecordsByType(events, dataElements, querySingleResource, absoluteApiPath);
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
    }, [events, dataElements, dataEngine, baseUrl, apiVersion]);

    useEffect(() => {
        if (orgUnitNames) {
            computeData();
        } else if (orgUnitNamesError) {
            setError(orgUnitNamesError);
        }
    }, [orgUnitNames, computeData, setError, orgUnitNamesError]);

    return { value, error, loading };
};


const useComputeHeaderColumn = (dataElements: Array<StageDataElement>, hideDueDate: boolean, enableUserAssignment: boolean, formFoundation: Object) => {
    const headerColumns = useMemo(() => {
        const dataElementHeaders = dataElements.reduce((acc, currDataElement) => {
            const { id, name, formName, type, optionSet } = currDataElement;
            if (!acc.find(item => item.id === id)) {
                if (isMultiTextWithoutOptionset(type, optionSet)) {
                    log.error(errorCreator(MULIT_TEXT_WITH_NO_OPTIONS_SET)({ currDataElement }));
                    return acc;
                }
                acc.push({ id, header: formName || name, type, sortDirection: SORT_DIRECTION.DEFAULT });
            }
            return acc;
        }, []);
        return [
            ...getBaseColumns({ formFoundation })
                .filter(col => (enableUserAssignment || col.id !== 'assignedUser') && (!hideDueDate || col.id !== 'scheduledAt')),
            ...dataElementHeaders];
    }, [dataElements, hideDueDate, enableUserAssignment, formFoundation]);

    return headerColumns;
};

const getDataElement = (stageDataElement, type) => {
    if (!stageDataElement) {
        return null;
    }

    const dataElement = new DataElement((o) => {
        o.id = stageDataElement.id;
        o.type = type;
    });

    if (stageDataElement.options) {
        const options = Object.keys(stageDataElement.options).map(
            (code: string) =>
                new Option((o) => {
                    // $FlowFixMe
                    o.text = stageDataElement.options[code];
                    o.value = code;
                }),
        );
        const optionSet = new OptionSet(stageDataElement.id, options);
        dataElement.optionSet = optionSet;
    }
    return dataElement;
};

const formatRowForView = (row: Object, dataElements: Array<StageDataElement>) => Object.keys(row).reduce((acc, id) => {
    const { type: predefinedType } = baseFields.find(f => f.id === id) || {};
    const stageDataElement = dataElements.find(el => el.id === id);
    const { type } = stageDataElement || {};
    const value = row[id];
    if (predefinedType) {
        acc[id] = convertClientToList(value, predefinedType);
    } else if (!type) {
        acc[id] = value;
    } else {
        const dataElement = getDataElement(stageDataElement, type);
        acc[id] = convertClientToList(value, type, dataElement);
    }
    return acc;
}, {});


export {
    useComputeDataFromEvent,
    useComputeHeaderColumn,
    formatRowForView,
};
