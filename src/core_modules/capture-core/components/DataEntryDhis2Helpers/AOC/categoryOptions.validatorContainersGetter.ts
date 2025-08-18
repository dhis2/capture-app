import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';
import type { ValidatorContainer } from '../../../utils/validation/getValidators';

const validateCategories = (value?: string | null, props?: any, fieldId?: string) => {
    const categoryName = props?.categories
        ?.find((category: any) => category.id === fieldId)?.label;

    return {
        valid: hasValue(value),
        errorMessage: i18n.t('Please select {{categoryName}}', { categoryName }),
    };
};

export const getCategoryOptionsValidatorContainers = (props?: any, fieldId?: string): Array<ValidatorContainer> => {
    const validatorContainers = [
        {
            validator: (value?: string | null) => validateCategories(value, props, fieldId),
            message: '',
            errorMessage: '',
        },
    ];
    return validatorContainers;
};
