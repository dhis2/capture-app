import i18n from '@dhis2/d2-i18n';

const validateNote = (value?: string) => !value;

type Labels = { note?: string; event?: string };

export const getNoteValidatorContainers = ({ note, event }: Labels = {}) => {
    const noteLabel = note ?? i18n.t('note');
    const eventLabel = event ?? i18n.t('event');
    const validatorContainers = [
        {
            validator: validateNote,
            errorMessage: i18n.t('Please add or cancel the {{note}} before saving the {{event}}', {
                note: noteLabel,
                event: eventLabel,
                interpolation: { escapeValue: false },
            }),
        },
    ];
    return validatorContainers;
};
