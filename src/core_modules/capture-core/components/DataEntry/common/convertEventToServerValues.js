// @flow
import { convertValue } from '../../../converters/clientToServer';
import { dataElementTypes } from '../../../metaData';

const mapEventClientKeyToServerKey = {
    eventId: 'event',
    programId: 'program',
    programStageId: 'programStage',
    orgUnitId: 'orgUnit',
    trackedEntityInstanceId: 'trackedEntityInstance',
    enrollmentId: 'enrollment',
};

export function getServerValuesToSaveFromMainEvent(event: CaptureClientEvent) {
    return Object
        .keys(event)
        .reduce((accServerEvent, inputKey) => {
            const valueToConvert = event[inputKey];
            let convertedValue;
            if (inputKey === 'occurredAt' || inputKey === 'scheduledAt' || inputKey === 'completedAt') {
                convertedValue = convertValue(valueToConvert, dataElementTypes.DATE);
            } else {
                convertedValue = valueToConvert;
            }


            // $FlowFixMe[prop-missing] automated comment
            const outputKey = mapEventClientKeyToServerKey[inputKey] || inputKey;
            accServerEvent[outputKey] = convertedValue;
            return accServerEvent;
        }, {});
}
