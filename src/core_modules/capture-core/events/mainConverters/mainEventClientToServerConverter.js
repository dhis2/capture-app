// @flow
import { convertClientToServer } from '../../converters';
import { convertMainEvent } from './mainEventConverter';
import { dataElementTypes } from '../../metaData';

export function convertMainEventClientToServer(event: Object) {
    const mapClientKeyToServerKey = {
        eventId: 'event',
        programId: 'program',
        programStageId: 'programStage',
        orgUnitId: 'orgUnit',
        trackedEntityInstanceId: 'trackedEntityInstance',
        enrollmentId: 'enrollment',
        assignee: 'assignedUser',
    };

    // eslint-disable-next-line complexity
    return convertMainEvent(event, mapClientKeyToServerKey, (key, value) => {
        let convertedValue;

        switch (key) {
        case 'eventDate':
        case 'dueDate':
        case 'completedDate':
            convertedValue = convertClientToServer(value, dataElementTypes.DATE);
            break;
        case 'assignee':
            convertedValue = value && value.id;
            break;
        default:
            convertedValue = value;
            break;
        }

        return convertedValue;
    });
}
