import { translatedStatusTypes } from 'capture-core/events/statusTypes';
import { convertServerToClient } from '../../../../../../../converters';
import type {
    ApiEvents,
    ApiEvent,
    ApiTeiAttributes,
    ApiTei,
    ApiDataElement,
    TeiColumnsMetaForDataFetchingArray,
    ClientEvents,
} from './types';
import { getFilterClientName, ADDITIONAL_FILTERS } from '../../../../helpers';
import { isEventOverdue } from '../../../../../../../utils/isEventOverdue';
import { RECORD_TYPE, buildUrlByElementType } from '../getListDataCommon';

const convertServerStatusToClient = (
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    scheduledAt: string,
) => {
    const translatedStatus = translatedStatusTypes();
    if (isEventOverdue({ status, scheduledAt })) {
        return translatedStatus.OVERDUE;
    }
    return translatedStatus[status];
};

const getAttributeById = (attributeValues: ApiTeiAttributes = []) =>
    attributeValues.reduce((acc, { attribute, value }) => {
        acc[attribute] = value;
        return acc;
    }, {});

const buildTEIRecord = ({
    columnsMetaForDataFetching,
    apiTEI,
    attributeValuesById,
    trackedEntity,
    programId,
}: {
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    apiTEI: ApiTei,
    attributeValuesById: any,
    trackedEntity: string,
    programId: string,
}) =>
    columnsMetaForDataFetching.map(({ id, mainProperty, type }) => {
        if (id === 'programOwnerId') {
            return {
                id,
                value: apiTEI.programOwners?.[0]?.orgUnit,
            };
        }

        const value = mainProperty ? apiTEI[id] : attributeValuesById[id];
        const urls = buildUrlByElementType[RECORD_TYPE.trackedEntity][type]
            ? buildUrlByElementType[RECORD_TYPE.trackedEntity][type]({ trackedEntity, id, programId })
            : {};

        return {
            id,
            value: convertServerToClient(value, type),
            ...urls,
        };
    });

const getDataValuesById = (dataValues: ApiDataElement = []) =>
    dataValues.reduce((acc, { dataElement, value }) => {
        acc[dataElement] = value;
        return acc;
    }, {});

const buildEventRecord = ({
    columnsMetaForDataFetching,
    apiEvent,
    dataValuesById,
}: {
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    apiEvent: ApiEvent,
    dataValuesById: any,
}) =>
    columnsMetaForDataFetching.map(({ id, mainProperty, type }) => {
        const isStatus = mainProperty && id === ADDITIONAL_FILTERS.status;
        const value = mainProperty ? apiEvent[id] : dataValuesById[id];
        const clientValue = isStatus
            ? convertServerStatusToClient(value, apiEvent.scheduledAt)
            : convertServerToClient(value, type);
        const urls = buildUrlByElementType[RECORD_TYPE.event][type]
            ? buildUrlByElementType[RECORD_TYPE.event][type]({ event: apiEvent.event, id })
            : {};

        return {
            id: getFilterClientName(id),
            value: clientValue,
            ...urls,
        };
    });

export const convertToClientEvents = (
    apiEvents: ApiEvents,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
): ClientEvents =>
    apiEvents.map((apiEvent) => {
        const dataValuesById = getDataValuesById(apiEvent.dataValues);
        const attributeValuesById = getAttributeById(apiEvent.parent?.attributes);
        const apiTEI = apiEvent.parent;
        const eventRecord = buildEventRecord({
            columnsMetaForDataFetching,
            apiEvent,
            dataValuesById,
        });
        const TEIRecord = apiTEI
            ? buildTEIRecord({
                columnsMetaForDataFetching,
                apiTEI,
                attributeValuesById,
                trackedEntity: apiEvent.trackedEntity,
                programId: apiEvent.program,
            })
            : [];

        const record = [
            ...eventRecord,
            ...TEIRecord,
        ]
            .filter(({ value }) => value != null)
            .reduce((acc, { id, value, imageUrl, previewUrl, fileUrl }: any) => {
                acc[id] = {
                    convertedValue: value,
                    fileUrl,
                    ...(imageUrl ? { imageUrl, previewUrl } : {}),
                };
                return acc;
            }, {});

        return {
            id: apiEvent.event,
            record,
        };
    });
