// @flow
import { capitalize } from './capitalize';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';
import { capitalizeFirstLetterInWords } from './capitalizeFirstLetterInWords';
import { formatterOptions } from './format.const';

const mapOptionsToFormatters = {
    [formatterOptions.CAPITALIZE]: capitalize,
    [formatterOptions.CAPITALIZE_FIRST_LETTER]: capitalizeFirstLetter,
    [formatterOptions.CAPITALIZE_FIRST_LETTER_IN_WORDS]: capitalizeFirstLetterInWords,
};

export function format(text: string, formatterOption: $Values<typeof formatterOptions>) {
    return mapOptionsToFormatters[formatterOption] ? mapOptionsToFormatters[formatterOption](text) : text;
}
