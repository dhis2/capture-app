// @flow
import { Validators } from '@dhis2/d2-ui-forms';
import i18n from '@dhis2/d2-i18n';
import moment from '../../../../utils/moment/momentResolver';
import parseDate from '../../../../utils/parsers/date.parser';

const isValidIncidentDate = (value: string, isFutureDateAllowed: boolean) => {
    const dateContainer = parseDate(value);
    if (!dateContainer.isValid) {
        return false;
    }

    if (isFutureDateAllowed) {
        return true;
    }

    const momentDate = dateContainer.momentDate;
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
            validator: Validators.wordToValidatorMap.get('required'),
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
