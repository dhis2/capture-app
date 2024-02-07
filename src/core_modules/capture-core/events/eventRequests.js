// @flow
import log from 'loglevel';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { errorCreator } from 'capture-core-utils';
import { programCollection } from '../metaDataMemoryStores/programCollection/programCollection';
import { convertValue } from '../converters/serverToClient';
import { dataElementTypes } from '../metaData';
import { getSubValues } from './getSubValues';
import type { QuerySingleResource } from '../utils/api/api.types';

type ApiDataValue = {
    dataElement: string,
    value: any
};

type ApiTEIEvent = {
    event: string,
    program: string,
    programStage: string,
    orgUnit: string,
    trackedEntityInstance?: string,
    enrollment?: string,
    enrollmentStatus?: string,
    status: string,
    occurredAt: string,
    dueDate: string,
    completedDate: string,
    dataValues: Array<ApiDataValue>,
    assignedUser?: ?{|
        uid: string,
        username: string,
        firstName: string,
        surname: string,
    |},
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
    trackedEntity: 'trackedEntityId',
    enrollment: 'enrollmentId',
};

function getConvertedValue(valueToConvert: any, inputKey: string) {
    let convertedValue;
    if (inputKey === 'occurredAt' || inputKey === 'scheduledAt' || inputKey === 'completedAt') {
        convertedValue = convertValue(valueToConvert, dataElementTypes.DATE);
    } else {
        convertedValue = valueToConvert;
    }
    return convertedValue;
}

function getAssignee(apiEvent: ApiTEIEvent) {
    if (!(apiEvent.assignedUser)) {
        return undefined;
    }

    const { uid, firstName, surname, username } = apiEvent.assignedUser;

    if (!firstName || !surname) {
        return undefined;
    }

    return {
        id: uid,
        username,
        name: `${firstName} ${surname}`,
    };
}
function convertMainProperties(apiEvent: ApiTEIEvent): CaptureClientEvent {
    const skipProps = ['dataValues', 'assignedUser'];

    return Object
        .keys(apiEvent)
        .reduce((accEvent, inputKey) => {
            if (inputKey === 'assignedUser') {
                const assignee = getAssignee(apiEvent);
                if (assignee) {
                    accEvent.assignee = assignee;
                }
            } else if (!skipProps.includes(inputKey)) {
                const valueToConvert = apiEvent[inputKey];
                const convertedValue = getConvertedValue(valueToConvert, inputKey);

                // $FlowFixMe[prop-missing] automated comment
                const outputKey = mapEventInputKeyToOutputKey[inputKey] || inputKey;

                // $FlowFixMe[incompatible-return] automated comment
                accEvent[outputKey] = convertedValue;
            }
            return accEvent;
        }, {});
}

async function convertToClientEvent(
    event: ApiTEIEvent,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
) {
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
    await getSubValues({
        eventId: event.event,
        programStage: stageForm,
        values: convertedDataValues,
        absoluteApiPath,
        querySingleResource,
    });


    const convertedMainProperties = convertMainProperties(event);

    return {
        id: convertedMainProperties.eventId,
        event: convertedMainProperties,
        values: convertedDataValues || {},
    };
}

export async function getEvent(
    eventId: string,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
): Promise<?ClientEventContainer> {
    const apiRes = await querySingleResource({
        resource: `tracker/events/${eventId}`,
    });
    const eventContainer = await convertToClientEvent(apiRes, absoluteApiPath, querySingleResource);
    return eventContainer;
}

export async function getEvents(
    queryParams: Object,
    absoluteApiPath: string,
    querySingleResource: QuerySingleResource,
) {
    const req = {
        url: 'tracker/events',
        queryParams,
    };
    const apiResponse = await querySingleResource({
        resource: 'tracker/events',
        params: queryParams,
    });

    const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, apiResponse);
    const eventContainers: Array<Object> = await apiEvents.reduce(async (accEventsPromise, apiEvent) => {
        const accEvents = await accEventsPromise;
        const eventContainer = await convertToClientEvent(apiEvent, absoluteApiPath, querySingleResource);
        if (eventContainer) {
            accEvents.push(eventContainer);
        }
        return accEvents;
    }, Promise.resolve([]));

    const pagingData = {
        rowsPerPage: queryParams.pageSize,
        currentPage: queryParams.page,
    };

    return {
        eventContainers,
        pagingData,
        request: req,
    };
}
