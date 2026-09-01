import { tCustomTerm } from '../../../../../../utils/tCustomTerm';

const validateNote = (value?: string) => !value;

export const getNoteValidatorContainers = (eventLabel: string) => [
    {
        validator: validateNote,
        errorMessage: tCustomTerm('Please add or cancel the note before saving the {{eventLabel}}', {
            eventLabel,
        }),
    },
];
