// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { EventsData, EventData } from '@dhis2/rules-engine-javascript';
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
    trackedEntity: 'trackedEntityId',
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

export const prepareEnrollmentEventsForRulesEngine =
    (apiEvents?: Array<ApiEnrollmentEvent> = [], currentEvent?: EventData): EventsData =>
        apiEvents
            .map(apiEvent => (currentEvent && currentEvent.eventId === apiEvent.event
                ? currentEvent
                : { ...convertMainProperties(apiEvent), ...convertDataValues(apiEvent) }),
            );
