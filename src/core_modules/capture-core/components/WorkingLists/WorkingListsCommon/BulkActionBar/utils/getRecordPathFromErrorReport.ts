import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../../../../../metaData';
import { buildUrlQueryString } from '../../../../../utils/routing';

type ErrorReport = {
    uid?: string;
    trackerType?: 'ENROLLMENT' | 'EVENT' | 'TRACKED_ENTITY' | string;
};

type BuildArgs = {
    uid: string;
    programId: string;
    orgUnitId: string;
    enrollmentIdToTeiId?: Record<string, string>;
    knownEventUids?: Set<string>;
    knownTeiUids?: Set<string>;
};

const buildEnrollmentPath = ({ uid, programId, orgUnitId, enrollmentIdToTeiId }: BuildArgs): string | null => {
    const teiId = enrollmentIdToTeiId?.[uid];
    if (!teiId) return null;
    return `/enrollment?${buildUrlQueryString({
        teiId,
        programId,
        orgUnitId,
        enrollmentId: uid,
    })}`;
};

const buildTeiPath = ({ uid, programId, orgUnitId, knownTeiUids }: BuildArgs): string | null => {
    if (!knownTeiUids?.has(uid)) return null;
    return `/enrollment?${buildUrlQueryString({
        teiId: uid,
        programId,
        orgUnitId,
        enrollmentId: 'AUTO',
    })}`;
};

const buildEventPath = ({ uid, programId, orgUnitId, knownEventUids }: BuildArgs): string | null => {
    // Only link an event UID we can vouch for — the error may reference a UID
    // the server rejected as nonexistent, and linking there is a dead end.
    if (!knownEventUids?.has(uid)) return null;
    try {
        const program = getProgramFromProgramIdThrowIfNotFound(programId);
        if (program instanceof EventProgram) {
            return `/viewEvent?${buildUrlQueryString({ viewEventId: uid, orgUnitId })}`;
        }
        return `/enrollmentEventEdit?${buildUrlQueryString({ eventId: uid, orgUnitId })}`;
    } catch (error) {
        log.error(errorCreator('Could not build record path for error report')({ error, programId }));
        return null;
    }
};

// Returns a router-style path (e.g. `/viewEvent?...`) matching the convention in
// `useLinkedRecordClick.ts`. Callers wanting an anchor `href` are responsible for
// prepending the HashRouter fragment marker (`#`).
export const getRecordPathFromErrorReport = ({
    errorReport,
    programId,
    orgUnitId,
    enrollmentIdToTeiId,
    knownEventUids,
    knownTeiUids,
}: {
    errorReport: ErrorReport;
    programId?: string;
    orgUnitId?: string;
    enrollmentIdToTeiId?: Record<string, string>;
    knownEventUids?: Set<string>;
    knownTeiUids?: Set<string>;
}): string | null => {
    if (!errorReport.uid || !programId || !orgUnitId) {
        return null;
    }

    const args: BuildArgs = {
        uid: errorReport.uid,
        programId,
        orgUnitId,
        enrollmentIdToTeiId,
        knownEventUids,
        knownTeiUids,
    };

    if (errorReport.trackerType === 'ENROLLMENT') return buildEnrollmentPath(args);
    if (errorReport.trackerType === 'TRACKED_ENTITY') return buildTeiPath(args);
    return buildEventPath(args);
};
