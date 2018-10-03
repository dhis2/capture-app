// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidPercentage = (value: string) => {
    const replacedValue = value.replace('%', '');
    const numberValidator = Validators.isNumber;
    return numberValidator(replacedValue);
};

export default isValidPercentage;
