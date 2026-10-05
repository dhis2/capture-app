import i18n from '@dhis2/d2-i18n';
import { hasValue } from 'capture-core-utils/validators/form';

const validateCategories = (
    value: string | null | undefined,
    props: any,
    fieldId: string | undefined,
    categoriesPropName: string,
) => {
    const categoryName = props?.[categoriesPropName]
        ?.find((category: any) => category.id === fieldId)?.displayName;

    return {
        valid: hasValue(value),
        errorMessage: i18n.t('Please select {{categoryName}}', { categoryName }),
    };
};

export const getCategoryOptionsValidatorContainers = (props?: any, fieldId?: string) => [
    {
        validator: (value?: string | null) => validateCategories(value, props, fieldId, 'categories'),
        errorMessage: '',
    },
];

export const getEnrollmentCategoryOptionsValidatorContainers = (props?: any, fieldId?: string) => [
    {
        validator: (value?: string | null) => validateCategories(value, props, fieldId, 'enrollmentCategories'),
        errorMessage: '',
    },
];
