// @flow
import i18n from '@dhis2/d2-i18n';
import { convertClientToList } from '../../converters';
import { convertMainEvent } from './mainEventConverter';
import { dataElementTypes } from '../../metaData';

export function convertMainEventClientToList(event: Object) {
    // eslint-disable-next-line complexity
    return convertMainEvent(event, {}, (key, value: any) => {
        let convertedValue;

        switch (key) {
        case 'eventDate':
        case 'dueDate':
        case 'completedDate':
            convertedValue = convertClientToList(value, dataElementTypes.DATE);
            break;
        case 'assignee':
            convertedValue = `${value.name} (${value.username})`;
            break;
        case 'status':
            if (value === 'ACTIVE') {
                convertedValue = i18n.t('Active');
            } else if (value === 'COMPLETED') {
                convertedValue = i18n.t('Completed');
            } else {
                convertedValue = value;
            }
            break;
        default:
            convertedValue = value;
            break;
        }

        return convertedValue;
    });
}
