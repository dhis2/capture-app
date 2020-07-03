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
                // $FlowFixMe[prop-missing] automated comment
                convertedValue = convertValue(valueToConvert, elementTypes.DATE);
            } else {
                convertedValue = valueToConvert;
            }

           
            // $FlowFixMe[prop-missing] automated comment
            const outputKey = mapEventClientKeyToServerKey[inputKey] || inputKey;
            accServerEvent[outputKey] = convertedValue;
            return accServerEvent;
        }, {});
}
