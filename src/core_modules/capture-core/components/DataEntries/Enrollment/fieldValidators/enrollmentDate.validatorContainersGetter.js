// @flow
import { hasValue } from 'capture-core-utils/validators/form';
import i18n from '@dhis2/d2-i18n';
import moment from 'capture-core-utils/moment/momentResolver';
import parseDate from 'capture-core-utils/parsers/date.parser';

const isValidEnrollmentDate = (value: string, isFutureDateAllowed: boolean) => {
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

const getValidatorContainers = (isFutureEnrollmentDateAllowed: boolean) => {
    const validatorContainers = [
        {
            validator: hasValue,
            message:
                i18n.t('A value is required'),
        },
        {
            validator: (value: string) => isValidEnrollmentDate(value, isFutureEnrollmentDateAllowed),
            message: i18n.t('Please provide a valid date'),
        },
    ];
    return validatorContainers;
};

export default getValidatorContainers;
