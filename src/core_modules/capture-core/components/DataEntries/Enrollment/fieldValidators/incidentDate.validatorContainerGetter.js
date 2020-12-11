// @flow
import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import moment from 'capture-core-utils/moment/momentResolver';
import { parseDate } from '../../../../utils/converters/date';

const isValidIncidentDate = (value: string, isFutureDateAllowed: boolean) => {
    const dateContainer = parseDate(value);
    if (!dateContainer.isValid) {
        return false;
    }

    if (isFutureDateAllowed) {
        return true;
    }

    const {momentDate} = dateContainer;
    const momentToday = moment();
    // $FlowFixMe -> if parseDate returns isValid true, there should always be a momentDate
    const isNotFutureDate = momentDate.isSameOrBefore(momentToday);
    return {
        valid: isNotFutureDate,
        message: i18n.t('A future date is not allowed'),
    };
};


const getValidatorContainers = (isFutureIncidentDateAllowed: boolean) => {
    const validatorContainers = [
        {
            validator: hasValue,
            message:
                i18n.t('A value is required'),
        },
        {
            validator: (value: string) => isValidIncidentDate(value, isFutureIncidentDateAllowed),
            message: i18n.t('Please provide a valid date'),
        },
    ];
    return validatorContainers;
};

export default getValidatorContainers;
