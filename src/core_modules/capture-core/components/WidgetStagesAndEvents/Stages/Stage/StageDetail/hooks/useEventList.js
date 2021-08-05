// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import { dataElementTypes } from '../../../../../../metaData';
import type { StageDataElement } from '../../../../types/common.types';
import { convertValue as convertClientToList } from '../../../../../../converters/clientToList';
import { convertValue as convertServerToClient } from '../../../../../../converters/serverToClient';
import {
    convertStatusForView,
    getValueByKeyFromEvent,
    mergeRecordsByType,
} from './helpers';
import { SORT_DIRECTION } from './constants';

const baseKeys = [{ id: 'status' }, { id: 'eventDate' }, { id: 'orgUnitName' }];
const basedFieldTypes = [
    { type: dataElementTypes.UNKNOWN, resolveValue: convertStatusForView },
    { type: dataElementTypes.DATE },
    { type: dataElementTypes.TEXT },
];
const baseColumnHeaders = [
    { header: i18n.t('Status'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: i18n.t('Report date'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true },
    { header: i18n.t('Registering unit'), sortDirection: SORT_DIRECTION.DEFAULT, isPredefined: true,
    }];

const baseFields = baseKeys.map((key, index) => ({ ...key, ...basedFieldTypes[index] }));
// $FlowFixMe
const baseColumns = baseFields.map((key, index) => ({ ...key, ...baseColumnHeaders[index] }));

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


const useComputeDataFromEvent = (dataElements: Array<StageDataElement>, events: Array<ApiTEIEvent>) => {
    const [dataSource, setDataSource] = React.useState([]);

    const computeData = async () => {
        const dataElementsByType = await mergeRecordsByType(events, dataElements);
        const eventsData = [];
        // $FlowFixMe
        for (const event of events) {
            const predefinedFields = baseFields.reduce((acc, field) => {
                acc[field.id] = convertServerToClient(getValueByKeyFromEvent(event, field), field.type);
                return acc;
            }, {});

            const allFields = getAllFieldsWithValue(dataElements, dataElementsByType);
            eventsData.push({ ...predefinedFields, ...allFields });
        }
        setDataSource(eventsData);
    };

    return { computeData, dataSource };
};

const useComputeHeaderColumn = (dataElements: Array<StageDataElement>) => {
    const headerColumns = useMemo(() => {
        const dataElementHeaders = dataElements.reduce((acc, currDataElement) => {
            const { id, name, type } = currDataElement;
            if (!acc.find(item => item.id === id)) {
                acc.push({ id, header: name, type, sortDirection: SORT_DIRECTION.DEFAULT });
            }
            return acc;
        }, []);
        return [...baseColumns, ...dataElementHeaders];
    }, [dataElements]);

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
