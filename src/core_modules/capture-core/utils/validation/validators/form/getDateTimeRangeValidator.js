// @flow
import { Temporal } from '@js-temporal/polyfill';
import { convertLocalToIsoCalendar } from 'capture-core/utils/converters/date';
import { isValidDateTime } from './dateTimeValidator';

function isValidDateTimeWithEmptyCheck(value: ?{date?: ?string, time?: ?string}, internalError?: ?{error: ?string, errorCode: ?string}) {
    return isValidDateTime(value, internalError);
}
/* eslint-disable complexity */
const convertDateTimeToIsoTemporal = (value: ?Object) => {
    if (!value || !value.date || !value.time) {
        return null;
    }

    const { date, time } = value;
    const isoDate = convertLocalToIsoCalendar(date);
    if (!isoDate) {
        return null;
    }
    const [year, month, day] = isoDate.split('T')[0].split('-').map(Number);

    let hour;
    let minutes;
    try {
        const timeStr = time.toString();
        if (/[:.]/.test(timeStr)) {
            [hour, minutes] = timeStr.split(/[:.]/).map(Number);
        } else if (timeStr.length === 3) {
            hour = Number(timeStr.substring(0, 1));
            minutes = Number(timeStr.substring(1, 3));
        } else if (timeStr.length === 4) {
            hour = Number(timeStr.substring(0, 2));
            minutes = Number(timeStr.substring(2, 4));
        } else {
            return null;
        }

        if (isNaN(hour) || isNaN(minutes) || hour < 0 || hour > 23 || minutes < 0 || minutes > 59) {
            return null;
        }

        return new Temporal.PlainDateTime(year, month, day, hour, minutes, 0, 0, 0, 0, 'iso8601');
    } catch (error) {
        return null;
    }
};

export const getDateTimeRangeValidator = (invalidDateTimeMessage: string) =>
    // eslint-disable-next-line complexity
    (value: { from?: ?Object, to?: ?Object }, internalComponentError?: ?{fromDateError: ?{error: ?string, errorCode: ?string}, toDateError: ?{error: ?string, errorCode: ?string}}) => {
        if (!value?.from && value?.to) {
            return {
                valid: false,
                errorMessage: { from: invalidDateTimeMessage, to: invalidDateTimeMessage },
            };
        }
        const errorResult = [];
        if (!isValidDateTimeWithEmptyCheck(value?.from, internalComponentError?.fromDateError).valid) {
            errorResult.push({ from: invalidDateTimeMessage });
        }

        if (!isValidDateTimeWithEmptyCheck(value?.to, internalComponentError?.toDateError).valid) {
            errorResult.push({ to: invalidDateTimeMessage });
        }

        if (errorResult.length > 0) {
            return {
                valid: false,
                // $FlowFixMe[exponential-spread] automated comment
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }

        const fromDateTime = convertDateTimeToIsoTemporal(value.from);
        const toDateTime = convertDateTimeToIsoTemporal(value.to);
        if (!fromDateTime || !toDateTime) {
            return {
                valid: false,
                errorMessage: {
                    from: !fromDateTime ? invalidDateTimeMessage : undefined,
                    to: !toDateTime ? invalidDateTimeMessage : undefined,
                },
            };
        }
        return {
            valid: Temporal.PlainDateTime.compare(fromDateTime, toDateTime) <= 0,
            errorMessage: undefined,
        };
    };
