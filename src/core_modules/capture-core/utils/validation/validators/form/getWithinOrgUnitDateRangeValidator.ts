import { Temporal } from '@js-temporal/polyfill';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { convertToIso8601 } from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import { convertIsoToLocalCalendar } from '../../../converters/date';

type OrgUnitDateRange = {
    openingDate?: string | null,
    closedDate?: string | null,
};

// Parses a Gregorian/ISO date string (date-only or full datetime) into a PlainDate.
const isoToPlainDate = (isoDate?: string | null): Temporal.PlainDate | null => {
    if (!isoDate) {
        return null;
    }
    try {
        return Temporal.PlainDate.from(isoDate.split('T')[0]);
    } catch (error) {
        log.debug(`getWithinOrgUnitDateRangeValidator: could not parse ISO date "${isoDate}"`, error);
        return null;
    }
};

// Parses a form value (a date string in the active calendar) into a Gregorian PlainDate.
// We convert via convertToIso8601 (which yields a Gregorian {year, month, day}) rather than
// round-tripping through moment().toISOString(), which would shift the day in non-UTC timezones.
const localToPlainDate = (localDate?: string | null): Temporal.PlainDate | null => {
    if (!localDate) {
        return null;
    }
    try {
        const calendar = systemSettingsStore.get().calendar;
        const { year, month, day } = convertToIso8601(localDate, calendar as any);
        return new Temporal.PlainDate(year, month, day);
    } catch (error) {
        log.debug(`getWithinOrgUnitDateRangeValidator: could not parse local date "${localDate}"`, error);
        return null;
    }
};

// Core boundary check: both bounds inclusive, day granularity. A missing bound leaves that side
// unconstrained; an unparseable date passes (dedicated date-format validators report invalid input).
const isPlainDateWithinOrgUnitRange = (date: Temporal.PlainDate | null, orgUnit?: OrgUnitDateRange | null): boolean => {
    if (!date) {
        return true;
    }
    const opening = isoToPlainDate(orgUnit?.openingDate);
    const closed = isoToPlainDate(orgUnit?.closedDate);

    if (opening && Temporal.PlainDate.compare(date, opening) < 0) {
        return false;
    }
    if (closed && Temporal.PlainDate.compare(date, closed) > 0) {
        return false;
    }
    return true;
};

// Checks a Gregorian/ISO date string against the org unit's opening/closing range. Used where the
// date is already stored (e.g. an enrollment date during transfer), not entered in the active calendar.
export const isIsoDateWithinOrgUnitRange = (isoDate?: string | null, orgUnit?: OrgUnitDateRange | null): boolean =>
    isPlainDateWithinOrgUnitRange(isoToPlainDate(isoDate), orgUnit);

const buildErrorMessage = (openingDate?: string | null, closedDate?: string | null): string => {
    const opening = openingDate ? convertIsoToLocalCalendar(openingDate) : undefined;
    const closed = closedDate ? convertIsoToLocalCalendar(closedDate) : undefined;

    if (opening && closed) {
        return i18n.t(
            "Date must be within the organisation unit's opening and closing dates ({{opening}} – {{closed}})",
            { opening, closed, interpolation: { escapeValue: false } },
        );
    }
    if (opening) {
        return i18n.t(
            "Date cannot be before the organisation unit's opening date ({{opening}})",
            { opening, interpolation: { escapeValue: false } },
        );
    }
    return i18n.t(
        "Date cannot be after the organisation unit's closing date ({{closed}})",
        { closed, interpolation: { escapeValue: false } },
    );
};

/**
 * Builds a form validator that constrains a date to the org unit's opening/closing range.
 * Both bounds are inclusive and compared at day granularity. A missing bound leaves that
 * side unconstrained; if neither is set the validator always passes.
 * @param orgUnit the org unit whose openingDate/closedDate (ISO/Gregorian) bound the date
 */
export const getWithinOrgUnitDateRangeValidator = (orgUnit?: OrgUnitDateRange | null) =>
    (value?: string | null) => {
        const openingDate = orgUnit?.openingDate;
        const closedDate = orgUnit?.closedDate;

        if (!value || (!openingDate && !closedDate)) {
            return true;
        }

        if (isPlainDateWithinOrgUnitRange(localToPlainDate(value), orgUnit)) {
            return true;
        }

        return {
            valid: false,
            errorMessage: buildErrorMessage(openingDate, closedDate),
        };
    };
