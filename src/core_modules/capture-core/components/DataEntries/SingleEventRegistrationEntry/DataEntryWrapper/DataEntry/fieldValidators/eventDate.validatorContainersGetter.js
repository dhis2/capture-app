// @flow
import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import { isValidDate } from '../../../../../../utils/validators/form';

const preValidateDate = (value?: ?string) => {
    if (!value) {
        return true;
    }

    return isValidDate(value);
};

const getValidatorContainers = () => {
    const validatorContainers = [
        {
            validator: hasValue,
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
