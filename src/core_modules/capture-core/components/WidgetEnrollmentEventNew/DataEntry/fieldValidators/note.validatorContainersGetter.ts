import { tCustomTerm } from '../../../../utils/tCustomTerm';

const validateNote = (value?: string | null) => !value;

export const getNoteValidatorContainers = (eventLabel: string, noteLabel: string) => [
    {
        validator: validateNote,
        errorMessage: tCustomTerm('Please add or cancel the {{noteLabel}} before saving the {{eventLabel}}', {
            eventLabel,
            noteLabel,
        }),
    },
];
