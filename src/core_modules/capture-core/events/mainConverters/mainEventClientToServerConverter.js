// @flow
import { convertClientToServer, convertAssigneeToServer } from '../../converters';
import { convertMainEvent } from './mainEventConverter';
import { dataElementTypes } from '../../metaData';
import { convertEventAttributeOptions } from '../convertEventAttributeOptions';

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
    event = convertEventAttributeOptions(event);
    // eslint-disable-next-line complexity
    return convertMainEvent(event, mapClientKeyToServerKey, (key, value) => {
        let convertedValue;

        switch (key) {
        case 'occurredAt':
        case 'scheduledAt':
        case 'completedAt':
            convertedValue = convertClientToServer(value, dataElementTypes.DATE);
            break;
        case 'assignee':
            convertedValue = value && convertAssigneeToServer(value);
            break;
        default:
            convertedValue = value;
            break;
        }

        return convertedValue;
    });
}
