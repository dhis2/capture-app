// @flow
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import { parseDate } from '../../converters/date';

export const isValidNonFutureDate = (value: string) => {
    const { isValid, momentDate } = parseDate(value);

    if (!isValid) {
        return isValid;
    }

    return {
        // $FlowFixMe -> if parseDate returns isValid true, there should always be a momentDate
        valid: momentDate.isSameOrBefore(moment()),
        message: i18n.t('A future date is not allowed'),
    };
};
