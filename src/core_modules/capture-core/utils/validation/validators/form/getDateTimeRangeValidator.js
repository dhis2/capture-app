// @flow
import { Temporal } from '@js-temporal/polyfill';
import { convertStringToTemporal } from 'capture-core/utils/converters/date';
import { isValidDateTime } from './dateTimeValidator';

function isValidDateTimeWithEmptyCheck(value: ?Object) {
    return value && isValidDateTime(value);
}
/* eslint-disable complexity */
const convertDateTimeToTemporal = (value: ?Object) => {
    if (!value || !value.date || !value.time) {
        return null;
    }

    const { date, time } = value;

    const dateInTemporalFormat = convertStringToTemporal(date);

    if (!dateInTemporalFormat) {
        return null;
    }
    const { year, month, day } = dateInTemporalFormat;

    let hour;
    let minutes;
    try {
        if (/[:.]/.test(time)) {
            [hour, minutes] = time.split(/[:.]/).map(Number);
        } else if (time.length === 3) {
            hour = Number(time.substring(0, 1));
            minutes = Number(time.substring(1, 3));
        } else if (time.length === 4) {
            hour = Number(time.substring(0, 2));
            minutes = Number(time.substring(2, 4));
        } else {
            return null;
        }

        if (isNaN(hour) || isNaN(minutes) || hour < 0 || hour > 23 || minutes < 0 || minutes > 59) {
            return null;
        }

        return new Temporal.PlainDateTime(year, month, day, hour, minutes);
    } catch (error) {
        return null;
    }
};

export const getDateTimeRangeValidator = (invalidDateTimeMessage: string) =>
    (value: { from?: ?Object, to?: ?Object }) => {
        if (!value) {
            return {
                valid: false,
                errorMessage: { from: invalidDateTimeMessage, to: invalidDateTimeMessage },
            };
        }
        const errorResult = [];
        if (!isValidDateTimeWithEmptyCheck(value.from)) {
            errorResult.push({ from: invalidDateTimeMessage });
        }

        if (!isValidDateTimeWithEmptyCheck(value.to)) {
            errorResult.push({ to: invalidDateTimeMessage });
        }

        if (errorResult.length > 0) {
            return {
                valid: false,
                // $FlowFixMe[exponential-spread] automated comment
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }

        const fromDateTime = convertDateTimeToTemporal(value.from);
        const toDateTime = convertDateTimeToTemporal(value.to);
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
