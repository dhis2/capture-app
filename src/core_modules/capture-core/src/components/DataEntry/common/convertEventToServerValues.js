// @flow
import { convertValue } from '../../../converters/clientToServer';
import elementTypes from '../../../metaData/DataElement/elementTypes';

const mapEventClientKeyToServerKey = {
    eventId: 'event',
    programId: 'program',
    programStageId: 'programStage',
    orgUnitId: 'orgUnit',
    trackedEntityInstanceId: 'trackedEntityInstance',
    enrollmentId: 'enrollment',
};

export default function getServerValuesToSaveFromMainEvent(event: CaptureClientEvent) {
    return Object
        .keys(event)
        .reduce((accServerEvent, inputKey) => {
            const valueToConvert = event[inputKey];
            let convertedValue;
            if (inputKey === 'eventDate' || inputKey === 'dueDate' || inputKey === 'completedDate') {
                convertedValue = convertValue(elementTypes.DATE, valueToConvert);
            } else {
                convertedValue = valueToConvert;
            }

            // $FlowSuppress
            const outputKey = mapEventClientKeyToServerKey[inputKey] || inputKey;
            accServerEvent[outputKey] = convertedValue;
            return accServerEvent;
        }, {});
}
