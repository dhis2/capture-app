import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';

const validateCategories = (value?: string | null, props?: any, fieldId?: string) => {
    const selectedCategory = props?.categories
        ?.find((category: any) => category.id === fieldId);
    const categoryName = selectedCategory?.label || selectedCategory?.displayName;

    return {
        valid: hasValue(value),
        errorMessage: i18n.t('Please select {{categoryName}}', { categoryName }),
    };
};

export const getCategoryOptionsValidatorContainers = (props?: any, fieldId?: string) => {
    const validatorContainers = [
        {
            validator: (value?: string | null) => validateCategories(value, props, fieldId),
            errorMessage: '',
        },
    ];
    return validatorContainers;
};
