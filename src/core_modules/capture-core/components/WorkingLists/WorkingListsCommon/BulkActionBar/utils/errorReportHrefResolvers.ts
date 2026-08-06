import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../../../../../metaData';
import { buildUrlQueryString } from '../../../../../utils/routing';
import type { ErrorReport, ErrorReportHrefResolver } from '../types';

// Resolvers return an anchor-ready href (`#/...`) or null when we can't (or shouldn't)
// link to the record. Each resolver only links a UID it can vouch for — the server may
// reference a UID it rejected as nonexistent, and following that is a dead end.

type EventFlavorDeps = {
    programId?: string;
    orgUnitId?: string;
    knownEventUids: Set<string>;
};

export const createEventErrorHrefResolver = ({
    programId, orgUnitId, knownEventUids,
}: EventFlavorDeps): ErrorReportHrefResolver => {
    // Resolve the program flavor once; programId doesn't vary across reports.
    let isEventProgram = false;
    let programResolvable = false;
    if (programId) {
        try {
            isEventProgram = getProgramFromProgramIdThrowIfNotFound(programId) instanceof EventProgram;
            programResolvable = true;
        } catch (error) {
            log.error(errorCreator('Could not resolve program for error link')({ error, programId }));
        }
    }

    return (errorReport: ErrorReport) => {
        const uid = errorReport.uid;
        if (!uid || !programId || !orgUnitId || !programResolvable) return null;
        if (!knownEventUids.has(uid)) return null;
        if (isEventProgram) {
            return `#/viewEvent?${buildUrlQueryString({ viewEventId: uid, orgUnitId })}`;
        }
        return `#/enrollmentEventEdit?${buildUrlQueryString({ eventId: uid, orgUnitId })}`;
    };
};

type TeiFlavorDeps = {
    programId?: string;
    orgUnitId?: string;
    knownTeiUids: Set<string>;
};

export const createTeiErrorHrefResolver = ({
    programId, orgUnitId, knownTeiUids,
}: TeiFlavorDeps): ErrorReportHrefResolver =>
    (errorReport: ErrorReport) => {
        const uid = errorReport.uid;
        if (!uid || !programId || !orgUnitId) return null;
        if (!knownTeiUids.has(uid)) return null;
        return `#/enrollment?${buildUrlQueryString({
            teiId: uid,
            programId,
            orgUnitId,
            enrollmentId: 'AUTO',
        })}`;
    };

type EnrollmentFlavorDeps = {
    programId?: string;
    orgUnitId?: string;
    enrollmentIdToTeiId: Record<string, string>;
    // Optional — enrollment Complete has these because it submits events too.
    knownEventUids?: Set<string>;
};

export const createEnrollmentErrorHrefResolver = ({
    programId, orgUnitId, enrollmentIdToTeiId, knownEventUids,
}: EnrollmentFlavorDeps): ErrorReportHrefResolver =>
    (errorReport: ErrorReport) => {
        const uid = errorReport.uid;
        if (!uid || !programId || !orgUnitId) return null;

        if (errorReport.trackerType === 'ENROLLMENT') {
            const teiId = enrollmentIdToTeiId[uid];
            if (!teiId) return null;
            return `#/enrollment?${buildUrlQueryString({
                teiId, programId, orgUnitId, enrollmentId: uid,
            })}`;
        }

        if (errorReport.trackerType === 'EVENT') {
            if (!knownEventUids?.has(uid)) return null;
            return `#/enrollmentEventEdit?${buildUrlQueryString({ eventId: uid, orgUnitId })}`;
        }

        return null;
    };
