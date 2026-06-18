import moment from 'moment';
import { formatMomentEn } from 'capture-core-utils/date';
import { convertIsoToLocalCalendar } from '../converters/date';

type OrgUnitDateRange = { openingDate?: string | null, closedDate?: string | null };

// The org unit opening date as a local-calendar string, for use as a calendar min bound.
export const getOrgUnitOpeningCalendarMin = (orgUnit?: OrgUnitDateRange | null) =>
    (orgUnit?.openingDate ? convertIsoToLocalCalendar(orgUnit.openingDate) : undefined);

// Combines an optional "no future date" limit with the org unit closing date, returning the
// earlier of the two as a local-calendar string for use as a calendar max bound.
export const getOrgUnitClosingCalendarMax = (
    orgUnit?: OrgUnitDateRange | null,
    futureNotAllowed = false,
) => {
    const candidates: Array<string> = [];
    if (futureNotAllowed) {
        candidates.push(formatMomentEn(moment(), 'YYYY-MM-DD'));
    }
    if (orgUnit?.closedDate) {
        candidates.push(orgUnit.closedDate.split('T')[0]);
    }
    if (!candidates.length) {
        return undefined;
    }
    const earliestIso = candidates.reduce((earliest, current) => (current < earliest ? current : earliest));
    return convertIsoToLocalCalendar(earliestIso);
};
