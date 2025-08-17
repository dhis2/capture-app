import { Temporal } from '@js-temporal/polyfill';
import { isValidDate } from './dateValidator';
import { convertLocalToIsoCalendar } from '../../../converters/date';

function isValidDateWithEmptyCheck(value: string | null | undefined, internalError?: {error?: string | null | undefined, errorCode?: string | null | undefined} | null | undefined) {
    return isValidDate(value, internalError);
}

export const getDateRangeValidator = (invalidDateMessage: string) =>
    (value: { from?: string | null, to?: string | null}, internalComponentError?: {fromError?: {error?: string | null | undefined, errorCode?: string | null | undefined} | null | undefined, toError?: {error?: string | null | undefined, errorCode?: string | null | undefined} | null | undefined} | null | undefined) => {
        const errorResult: any[] = [];
        if (!isValidDateWithEmptyCheck(value.from, internalComponentError?.fromError).valid) {
            errorResult.push({ from: invalidDateMessage });
        }

        if (!isValidDateWithEmptyCheck(value.to, internalComponentError?.toError).valid) {
            errorResult.push({ to: invalidDateMessage });
        }

        if (errorResult.length > 0) {
            return {
                valid: false,
                errorMessage: errorResult.reduce((map, error) => ({ ...map, ...error }), {}),
            };
        }
        const { from, to } = value;
        const isoFrom = convertLocalToIsoCalendar(from || null);
        const isoTo = convertLocalToIsoCalendar(to || null);

        if (!isoFrom || !isoTo) {
            return {
                valid: false,
                errorMessage: { date: invalidDateMessage },
            };
        }

        const fromDate = Temporal.PlainDate.from(isoFrom.split('T')[0]);
        const toDate = Temporal.PlainDate.from(isoTo.split('T')[0]);

        return {
            valid: Temporal.PlainDate.compare(fromDate, toDate) <= 0,
            errorMessage: undefined,
        };
    };
