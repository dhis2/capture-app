import i18n from '@dhis2/d2-i18n';

const validateNote = (value?: string) => !value;

export const getNoteValidatorContainers = (eventLabel: string, noteLabel: string) => [
    {
        validator: validateNote,
        errorMessage: i18n.t('Please add or cancel the {{noteLabel}} before saving the {{eventLabel}}', {
            eventLabel,
            noteLabel,
        }),
    },
];
