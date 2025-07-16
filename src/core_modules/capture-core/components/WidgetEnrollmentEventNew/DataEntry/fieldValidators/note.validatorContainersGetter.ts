import i18n from '@dhis2/d2-i18n';

const validateNote = (value?: string | null) => !value;

export const getNoteValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: validateNote,
            errorMessage: i18n.t('Please add or cancel the note before saving the event'),
        },
    ];
    return validatorContainers;
};
