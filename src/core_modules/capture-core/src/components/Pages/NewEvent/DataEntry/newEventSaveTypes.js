// @flow
import i18n from '@dhis2/d2-i18n';

export const saveTypes = {
    SAVEANDADDANOTHER: 'SAVEANDADDANOTHER',
    SAVEANDEXIT: 'SAVEANDEXIT',
};

export const saveTypeDefinitions = {
    [saveTypes.SAVEANDADDANOTHER]: {
        key: saveTypes.SAVEANDADDANOTHER, text: i18n.t('Save and add another'),
    },
    [saveTypes.SAVEANDEXIT]: {
        key: saveTypes.SAVEANDEXIT, text: i18n.t('Save and exit'),
    },
};
