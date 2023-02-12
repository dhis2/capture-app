// @flow
import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';

const validateCategories = (value?: ?string) => hasValue(value);

export const getCategoryOptionsValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: validateCategories,
            message: i18n.t('Please add category before saving the event'),
        },
    ];
    return validatorContainers;
};
