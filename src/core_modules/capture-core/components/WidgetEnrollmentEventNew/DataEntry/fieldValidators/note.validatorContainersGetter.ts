import { customTerms } from '../../../../utils/customTerms';

const validateNote = (value?: string | null) => !value;

export const getNoteValidatorContainers = (eventLabel: string, noteLabel: string) => [
    {
        validator: validateNote,
        errorMessage: customTerms.i18n.t('Please add or cancel the {{noteLabel}} before saving the {{eventLabel}}', {
            eventLabel,
            noteLabel,
        }),
    },
];
