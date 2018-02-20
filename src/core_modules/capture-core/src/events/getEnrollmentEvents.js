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
    trackedEntityInstance: string,
    enrollment: string,
    enrollmentStatus: string,
    status: string,
    eventDate: string,
    dueDate: string,
    dataValues: Array<ApiDataValue>
};

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

function getValuesById(apiDataValues: Array<ApiDataValue>) {
    return apiDataValues.reduce((accValues, dataValue) => {
        accValues[dataValue.dataElement] = dataValue.value;
        return accValues;
    }, {});
}

function convertMainProperties(apiEvent: ApiTEIEvent): Event {
    return {
        eventId: apiEvent.event,
        programId: apiEvent.program,
        programStageId: apiEvent.programStage,
        orgUnitId: apiEvent.orgUnit,
        orgUnitName: apiEvent.orgUnitName,
        trackedEntityInstanceId: apiEvent.trackedEntityInstance,
        enrollmentId: apiEvent.enrollment,
        enrollmentStatus: apiEvent.enrollmentStatus,
        status: apiEvent.status,
        eventDate: convertValue(elementTypes.DATE, apiEvent.eventDate),
        dueDate: convertValue(elementTypes.DATE, apiEvent.dueDate),
    };
}

function convertToClientEvent(event: ApiTEIEvent) {
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

    const dataValuesById = getValuesById(event.dataValues);
    const convertedDataValues = stageMetaData.convertValues(dataValuesById, convertValue);

    const convertedMainProperties = convertMainProperties(event);

    return {
        id: convertedMainProperties.eventId,
        event: convertedMainProperties,
        values: convertedDataValues,
    };
}

export default async function getEnrollmentEvents() {
    const api = getApi();
    const apiRes = await api
        .get('events?program=eBAyeGv0exc');

    if (!apiRes || !apiRes.events || apiRes.events.length === 0) {
        return null;
    }

    return apiRes.events.reduce((accEvents, apiEvent) => {
        const eventContainer = convertToClientEvent(apiEvent);
        if (eventContainer) {
            accEvents.push(eventContainer);
        }
        return accEvents;
    }, []);
}
