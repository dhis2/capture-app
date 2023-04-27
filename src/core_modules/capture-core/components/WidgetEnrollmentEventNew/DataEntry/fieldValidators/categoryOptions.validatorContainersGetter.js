// @flow
import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';

const validateCategories = (value?: ?string, props?: Object, fieldId?: string) => {
    const selectedCategory = props?.categories
        ?.find(category => category.id === fieldId);
    const categoryName = selectedCategory?.label || selectedCategory?.displayName;

    return {
        valid: hasValue(value),
        message: i18n.t('Please select {{categoryName}}', { categoryName }),
    };
};

export const getCategoryOptionsValidatorContainers = (props?: Object, fieldId?: string) => {
    const validatorContainers = [
        {
            validator: (value?: ?string) => validateCategories(value, props, fieldId),
            message: '',
        },
    ];
    return validatorContainers;
};
