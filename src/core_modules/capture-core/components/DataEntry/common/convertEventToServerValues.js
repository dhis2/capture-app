// @flow
import { dataElementTypes } from '../../../metaData';
import { convertValue } from '../../../converters/clientToServer';

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
            if (inputKey === 'eventDate' || inputKey === 'dueDate' || inputKey === 'completedDate') {
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
