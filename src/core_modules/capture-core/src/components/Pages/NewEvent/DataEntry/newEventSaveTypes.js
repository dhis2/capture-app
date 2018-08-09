// @flow
import i18n from '@dhis2/d2-i18n';

export const newEventSaveTypes = {
    SAVEANDADDANOTHER: 'SAVEANDADDANOTHER',
    SAVEANDEXIT: 'SAVEANDEXIT',
};

export const newEventSaveTypeDefinitions = {
    [newEventSaveTypes.SAVEANDADDANOTHER]: {
        key: newEventSaveTypes.SAVEANDADDANOTHER, text: i18n.t('Save and add another'),
    },
    [newEventSaveTypes.SAVEANDEXIT]: {
        key: newEventSaveTypes.SAVEANDEXIT, text: i18n.t('Save and exit'),
    },
};
