import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../../../../../metaData';
import { buildUrlQueryString } from '../../../../../utils/routing';
import type { ErrorReport, ErrorReportHrefResolver } from '../types';

type EventRoute = 'viewEvent' | 'enrollmentEventEdit';

const resolveEventRoute = (programId: string): EventRoute | null => {
    try {
        return getProgramFromProgramIdThrowIfNotFound(programId) instanceof EventProgram
            ? 'viewEvent'
            : 'enrollmentEventEdit';
    } catch (error) {
        log.error(errorCreator('Could not resolve program for error link')({ error, programId }));
        return null;
    }
};

type EventFlavorDeps = {
    programId?: string;
    orgUnitId?: string;
    knownEventUids: Set<string>;
};

export const createEventErrorHrefResolver = ({
    programId, orgUnitId, knownEventUids,
}: EventFlavorDeps): ErrorReportHrefResolver =>
    (errorReport: ErrorReport) => {
        const uid = errorReport.uid;
        if (!uid || !programId || !orgUnitId || !knownEventUids.has(uid)) return null;
        const route = resolveEventRoute(programId);
        if (!route) return null;
        return route === 'viewEvent'
            ? `#/viewEvent?${buildUrlQueryString({ viewEventId: uid, orgUnitId })}`
            : `#/enrollmentEventEdit?${buildUrlQueryString({ eventId: uid, orgUnitId })}`;
    };

type EnrollmentFlavorDeps = {
    programId?: string;
    orgUnitId?: string;
    enrollmentIdToTeiId: Record<string, string>;
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
