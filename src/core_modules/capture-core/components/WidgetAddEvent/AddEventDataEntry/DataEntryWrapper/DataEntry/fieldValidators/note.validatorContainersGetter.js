// @flow
import i18n from '@dhis2/d2-i18n';

const validateNote = (value?: ?string) => !value;

export const getNoteValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: validateNote,
            message: i18n.t('Please add or cancel comment before saving the event'),
        },
    ];
    return validatorContainers;
};
