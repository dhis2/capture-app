// @flow
import { moment } from 'capture-core-utils/moment';

export default function parseTime(value: string) {
    const momentTime = moment(value, ['HH:mm', 'H:mm', 'HH.mm', 'H.mm'], true);
    return {
        isValid: momentTime.isValid(),
        momentTime,
    };
}
