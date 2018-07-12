// @flow
import { Validators } from '@dhis2/d2-ui-forms';

/**
 *
 * @export
 * @param {string} value
 * @param {boolean} [isEmptyValid=false] By default empty is invalid. In your form you should precheck this and not call isValidPercentage if empty.
 * @returns
 */
const isValidPercentage = (value: string, isEmptyValid: boolean = false) => {
    if (!value) {
        return isEmptyValid;
    }

    const replacedValue = value.replace('%', '');
    const numberValidator = Validators.isNumber;
    return numberValidator(replacedValue);
};

export default isValidPercentage;
