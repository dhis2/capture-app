// @flow
import { canViewOtherUsers } from '../../d2';
import { convertClientToServer } from '../../converters';
import { convertMainEvent } from './mainEventConverter';
import elementTypeKeys from '../../metaData/DataElement/elementTypes';

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
            // $FlowFixMe[prop-missing] automated comment
            convertedValue = convertClientToServer(value, elementTypeKeys.DATE);
            break;
        case 'assignee':
            convertedValue = canViewOtherUsers() ? value && value.id : value;
            break;
        default:
            convertedValue = value;
            break;
        }

        return convertedValue;
    });
}
