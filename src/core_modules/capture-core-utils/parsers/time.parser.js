// @flow
import moment from 'moment';

export function parseTime(value: string) {
    const momentTime = moment(value, ['HH:mm', 'H:mm', 'HH.mm', 'H.mm'], true);
    return {
        isValid: momentTime.isValid(),
        momentTime,
    };
}
