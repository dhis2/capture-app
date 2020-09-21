// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getApi } from '../d2/d2Instance';
import programCollection from '../metaDataMemoryStores/programCollection/programCollection';
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

const mapEventInputKeyToOutputKey = {
    event: 'eventId',
    program: 'programId',
    programStage: 'programStageId',
    orgUnit: 'orgUnitId',
    trackedEntityInstance: 'trackedEntityInstanceId',
    enrollment: 'enrollmentId',
};

function convertMainProperties(apiEvent: ApiTEIEvent): CaptureClientEvent {
    return Object
        .keys(apiEvent)
        .reduce((accEvent, inputKey) => {
            if (inputKey !== 'dataValues') {
                // $FlowFixMe[prop-missing] automated comment
                const valueToConvert = apiEvent[inputKey];
                let convertedValue;
                if (inputKey === 'eventDate' || inputKey === 'dueDate' || inputKey === 'completedDate') {
                    convertedValue = convertValue(valueToConvert, elementTypes.DATE);
                } else {
                    convertedValue = valueToConvert;
                }


                // $FlowFixMe[prop-missing] automated comment
                const outputKey = mapEventInputKeyToOutputKey[inputKey] || inputKey;

                // $FlowFixMe[incompatible-return] automated comment
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
        .get('events?program=eBAyeGv0exc&orgUnit=DiszpKrYNg8&paging=false');
        // .get('events?event=qEHQdXkUAGk');

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
