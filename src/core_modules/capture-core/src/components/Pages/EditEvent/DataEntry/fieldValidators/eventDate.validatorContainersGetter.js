// @flow
import { Validators } from '@dhis2/d2-ui-forms';
import isValidDate from '../../../../../utils/validators/date.validator';
import { getTranslation } from '../../../../../d2/d2Instance';
import { formatterOptions } from '../../../../../utils/string/format.const';

const preValidateDate = (value?: ?string) => {
    if (!value) {
        return true;
    }

    return isValidDate(value);
};

const getValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: Validators.wordToValidatorMap.get('required'),
            message:
                getTranslation(
                    Validators.wordToValidatorMap.get('required').message,
                    formatterOptions.CAPITALIZE_FIRST_LETTER),
        },
        {
            validator: preValidateDate,
            message: getTranslation('value_should_be_a_valid_date', formatterOptions.CAPITALIZE_FIRST_LETTER),
        },
    ];
    return validatorContainers;
};

export default getValidatorContainers;
