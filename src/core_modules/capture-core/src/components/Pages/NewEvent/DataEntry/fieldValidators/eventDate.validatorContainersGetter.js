// @flow
import { Validators } from '@dhis2/d2-ui-forms';
import i18n from '@dhis2/d2-i18n';
import isValidDate from '../../../../../utils/validators/form/date.validator';

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
                i18n.t('A value is required'),
        },
        {
            validator: preValidateDate,
            message: i18n.t('Please provide a valid date'),
        },
    ];
    return validatorContainers;
};

export default getValidatorContainers;
