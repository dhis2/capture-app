// @flow
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { parseDate } from '../../converters/date';

const CUSTOM_VALIDATION_MESSAGES = {
    INVALID_DATE_MORE_THAN_MAX: i18n.t('A date in the future is not allowed'),
};

export const isValidNonFutureDate = (value: string) => {
    const { isValid, momentDate } = parseDate(value);

    if (!isValid) {
        return isValid;
    }

    return {
        // $FlowFixMe -> if parseDate returns isValid true, there should always be a momentDate
        valid: momentDate.isSameOrBefore(moment()),
        errorMessage: CUSTOM_VALIDATION_MESSAGES.INVALID_DATE_MORE_THAN_MAX,
    };
};
