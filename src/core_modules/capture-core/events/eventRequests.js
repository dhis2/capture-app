// @flow
import log from 'loglevel';
import { getApi } from '../d2/d2Instance';
import programCollection from '../metaDataMemoryStores/programCollection/programCollection';
import { errorCreator } from 'capture-core-utils';
import { convertValue } from '../converters/serverToClient';
import elementTypes from '../metaData/DataElement/elementTypes';
import { getSubValues } from './getSubValues';
import { addPostSubValues } from './postSubValues';

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
    dataValues: Array<ApiDataValue>,
    assignedUser?: ?string,
};

export type ClientEventContainer = {
    id: string,
    event: CaptureClientEvent,
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
    assignedUser: 'assignedUserId',
};

function getConvertedValue(valueToConvert: any, inputKey: string) {
    let convertedValue;
    if (inputKey === 'eventDate' || inputKey === 'dueDate' || inputKey === 'completedDate') {
        convertedValue = convertValue(valueToConvert, elementTypes.DATE);
    } else {
        convertedValue = valueToConvert;
    }
    return convertedValue;
}
function convertMainProperties(apiEvent: ApiTEIEvent): CaptureClientEvent {
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

async function convertToClientEvent(event: ApiTEIEvent) {
    const programMetaData = programCollection.get(event.program);
    if (!programMetaData) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ fn: 'convertToClientEvent', event }));
        return null;
    }

    const stageMetaData = programMetaData.getStage(event.programStage);
    if (!stageMetaData) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ fn: 'convertToClientEvent', event }));
        return null;
    }
    const stageForm = stageMetaData.stageForm;

    const dataValuesById = getValuesById(event.dataValues);
    const convertedDataValues = stageForm.convertValues(dataValuesById, convertValue);
    await getSubValues(event.event, stageForm, convertedDataValues);

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
    const req = {
        url: 'events',
        queryParams: {
            ...queryParams,
            totalPages: true,
        },
    };
    const apiRes = await api
        .get(req.url, { ...req.queryParams });

    const eventContainers = apiRes && apiRes.events ? await apiRes.events.reduce(async (accEventsPromise, apiEvent) => {
        const accEvents = await accEventsPromise;
        const eventContainer = await convertToClientEvent(apiEvent);
        if (eventContainer) {
            accEvents.push(eventContainer);
        }
        return accEvents;
    }, Promise.resolve([])) : null;

    const eventContainersWithSubValues = eventContainers ? (await addPostSubValues(eventContainers)) : null;

    const pagingData = {
        rowsCount: apiRes.pager.total,
        rowsPerPage: apiRes.pager.pageSize,
        currentPage: apiRes.pager.page,
    };

    return {
        eventContainers: eventContainersWithSubValues,
        pagingData,
        request: req,
    };
}
