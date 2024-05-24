// @flow
import { convertClientToServer } from '../../converters';
import { convertMainEvent } from './mainEventConverter';
import { dataElementTypes } from '../../metaData';
import { convertEventAttributeOptions } from '../convertEventAttributeOptions';

export function convertMainEventClientToServer(event: Object, serverMinorVersion: number) {
    const mapClientKeyToServerKey = {
        eventId: 'event',
        programId: 'program',
        programStageId: 'programStage',
        orgUnitId: 'orgUnit',
        trackedEntityId: 'trackedEntity',
        enrollmentId: 'enrollment',
        assignee: 'assignedUser',
    };
    event = convertEventAttributeOptions(event, serverMinorVersion);
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
            convertedValue = value && convertClientToServer(value, dataElementTypes.ASSIGNEE);
            break;
        default:
            convertedValue = value;
            break;
        }

        return convertedValue;
    });
}
