// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { EventsData, EventData } from 'capture-core-utils/rulesEngine';
import { getApi } from '../d2/d2Instance';
import { programCollection } from '../metaDataMemoryStores/programCollection/programCollection';
import { convertValue } from '../converters/serverToClient';
import { dataElementTypes } from '../metaData';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
    STAGE_FORM_NOT_FOUND: 'Stage form not found',
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

function convertDataValues(apiEvent: ApiEnrollmentEvent) {
    const programMetaData = programCollection.get(apiEvent.program);
    if (!programMetaData) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ fn: 'convertDataValues', apiEvent }));
        return null;
    }
    const stageMetaData = programMetaData.getStage(apiEvent.programStage);
    if (!stageMetaData) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ fn: 'convertDataValues', apiEvent }));
        return null;
    }
    const stageForm = stageMetaData.stageForm;
    if (!stageForm) {
        log.error(errorCreator(errorMessages.STAGE_FORM_NOT_FOUND)({ fn: 'convertDataValues', apiEvent }));
        return null;
    }

    const dataValuesById = getValuesById(apiEvent.dataValues);
    const convertedDataValues = stageForm.convertValues && stageForm.convertValues(dataValuesById, convertValue);
    return convertedDataValues;
}

function convertMainProperties(apiEvent: ApiEnrollmentEvent): (CaptureClientEvent & EventData) {
    return Object
        .keys(apiEvent)
        .reduce((accEvent, inputKey) => {
            if (inputKey !== 'dataValues') {
                // $FlowFixMe[prop-missing] automated comment
                const valueToConvert = apiEvent[inputKey];
                let convertedValue;
                if (inputKey === 'occurredAt' || inputKey === 'scheduledAt' || inputKey === 'completedAt') {
                    convertedValue = convertValue(valueToConvert, dataElementTypes.DATE);
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

function convertToClientEvent(event: ApiEnrollmentEvent) {
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
    // $FlowFixMe[prop-missing] automated comment
    const convertedDataValues = stageMetaData.convertValues(dataValuesById, convertValue);

    const convertedMainProperties = convertMainProperties(event);

    return {
        id: convertedMainProperties.eventId,
        event: convertedMainProperties,
        values: convertedDataValues,
    };
}

export async function getEnrollmentEvents() {
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

export const prepareEnrollmentEventsForRulesEngine =
    (apiEvents?: Array<ApiEnrollmentEvent> = [], currentEvent?: EventData): EventsData =>
        apiEvents
            .map(apiEvent => (currentEvent && currentEvent.eventId === apiEvent.event
                ? currentEvent
                : { ...convertMainProperties(apiEvent), ...convertDataValues(apiEvent) }),
            );
