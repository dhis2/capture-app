// @flow
import { formatterOptions } from './format.const';
import { capitalizeFirstLetterInWords } from './capitalizeFirstLetterInWords';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';
import { capitalize } from './capitalize';

const mapOptionsToFormatters = {
    [formatterOptions.CAPITALIZE]: capitalize,
    [formatterOptions.CAPITALIZE_FIRST_LETTER]: capitalizeFirstLetter,
    [formatterOptions.CAPITALIZE_FIRST_LETTER_IN_WORDS]: capitalizeFirstLetterInWords,
};

export function format(text: string, formatterOption: $Values<typeof formatterOptions>) {
    return mapOptionsToFormatters[formatterOption] ? mapOptionsToFormatters[formatterOption](text) : text;
}
