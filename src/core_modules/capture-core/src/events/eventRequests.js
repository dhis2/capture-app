// @flow
import log from 'loglevel';
import { getApi } from '../d2/d2Instance';
import programCollection from '../metaDataMemoryStores/programCollection/programCollection';
import errorCreator from '../utils/errorCreator';
import { convertValue } from '../converters/serverToClient';
import elementTypes from '../metaData/DataElement/elementTypes';

type ApiDataValue = {
    dataElement: string,
    value: any
};

type ApiTEIEvent = {
    event: string,
    program: string,
    programStage: string,
    orgUnit: string,
    orgUnitName: string,
    trackedEntityInstance?: string,
    enrollment?: string,
    enrollmentStatus?: string,
    status: string,
    eventDate: string,
    dueDate: string,
    completedDate: string,
    dataValues: Array<ApiDataValue>
};

export type ClientEventContainer = {
    id: string,
    event: Event,
    values: { [key: string]: any },
};

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

function getValuesById(apiDataValues: Array<ApiDataValue>) {
    if (!apiDataValues) {
        return apiDataValues;
    }

    return apiDataValues.reduce((accValues, dataValue) => {
        accValues[dataValue.dataElement] = dataValue.value;
        return accValues;
    }, {});
}

const mapEventInputKeyToOutputKey = {
    event: 'eventId',
    program: 'programId',
    programStage: 'programStageId',
    orgUnit: 'orgUnitId',
    trackedEntityInstance: 'trackedEntityInstanceId',
    enrollment: 'enrollmentId',
};

function getConvertedValue(valueToConvert: any, inputKey: string) {
    let convertedValue;
    if (inputKey === 'eventDate' || inputKey === 'dueDate' || inputKey === 'completedDate') {
        convertedValue = convertValue(elementTypes.DATE, valueToConvert);
    } else {
        convertedValue = valueToConvert;
    }
    return convertedValue;
}
function convertMainProperties(apiEvent: ApiTEIEvent): Event {
    return Object
        .keys(apiEvent)
        .reduce((accEvent, inputKey) => {
            if (inputKey !== 'dataValues') {
                const valueToConvert = apiEvent[inputKey];
                const convertedValue = getConvertedValue(valueToConvert, inputKey);
                // $FlowSuppress
                const outputKey = mapEventInputKeyToOutputKey[inputKey] || inputKey;
                // $FlowSuppress
                accEvent[outputKey] = convertedValue;
            }
            return accEvent;
        }, {});
}

function convertToClientEvent(event: ApiTEIEvent) {
    const programMetaData = programCollection.get(event.program);
    if (!programMetaData) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ fn: 'convertToClientEvent', event }));
        return null;
    }

    // $FlowSuppress :TODO
    const stageMetaData = programMetaData.getStage(event.programStage);
    if (!stageMetaData) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ fn: 'convertToClientEvent', event }));
        return null;
    }

    const dataValuesById = getValuesById(event.dataValues);
    const convertedDataValues = stageMetaData.convertValues(dataValuesById, convertValue);

    const convertedMainProperties = convertMainProperties(event);

    return {
        id: convertedMainProperties.eventId,
        event: convertedMainProperties,
        values: convertedDataValues || {},
    };
}

export async function getEvent(eventId: string): Promise<?ClientEventContainer> {
    const api = getApi();
    const apiRes = await api
        .get(`events/${eventId}`);

    const eventContainer = convertToClientEvent(apiRes);
    return eventContainer;
}

export async function getEvents(queryParams: ?Object) {
    const api = getApi();
    const apiRes = await api
        .get('events', { ...queryParams, totalPages: true });

    const eventContainers = apiRes && apiRes.events ? apiRes.events.reduce((accEvents, apiEvent) => {
        const eventContainer = convertToClientEvent(apiEvent);
        if (eventContainer) {
            accEvents.push(eventContainer);
        }
        return accEvents;
    }, []) : null;

    const pagingData = {
        rowsCount: apiRes.pager.total,
        rowsPerPage: apiRes.pager.pageSize,
        currentPage: apiRes.pager.page,
    };

    return {
        eventContainers,
        pagingData,
    };
}
