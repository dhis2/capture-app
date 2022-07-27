// @flow
import moment from 'moment';
import { parseDate } from 'capture-core/utils/converters/date';

export const isValidNonFutureDate = (value: string) => {
    const { isValid, momentDate } = parseDate(value);

    // $FlowFixMe -> if parseDate returns isValid true, there should always be a momentDate
    return isValid && momentDate.isSameOrBefore(moment());
};
