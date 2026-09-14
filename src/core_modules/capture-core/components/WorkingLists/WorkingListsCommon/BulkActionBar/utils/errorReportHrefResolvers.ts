import { EventProgram } from '../../../../../metaData';
import { programCollection } from '../../../../../metaDataMemoryStores/programCollection/programCollection';
import { buildUrlQueryString } from '../../../../../utils/routing';
import type { ErrorReport, ErrorReportHrefResolver } from '../types';

type EventFlavorDeps = {
    programId?: string;
    orgUnitId?: string;
};

export const createEventErrorHrefResolver = ({
    programId, orgUnitId,
}: EventFlavorDeps): ErrorReportHrefResolver =>
    (errorReport: ErrorReport) => {
        if (!programId) return null;

        const program = programCollection.get(programId);
        if (!program) return null;

        return program instanceof EventProgram
            ? `#/viewEvent?${buildUrlQueryString({ viewEventId: errorReport.uid, orgUnitId })}`
            : `#/enrollmentEventEdit?${buildUrlQueryString({ eventId: errorReport.uid, orgUnitId })}`;
    };

type EnrollmentFlavorDeps = {
    programId?: string;
    orgUnitId?: string;
    enrollmentIdToTeiId: Record<string, string>;
};

export const createEnrollmentErrorHrefResolver = ({
    programId, orgUnitId, enrollmentIdToTeiId,
}: EnrollmentFlavorDeps): ErrorReportHrefResolver =>
    (errorReport: ErrorReport) => {
        if (!programId) return null;
        const { uid } = errorReport;

        if (errorReport.trackerType === 'ENROLLMENT') {
            const teiId = enrollmentIdToTeiId[uid];
            if (!teiId) return null;
            return `#/enrollment?${buildUrlQueryString({
                teiId, programId, orgUnitId, enrollmentId: uid,
            })}`;
        }

        if (errorReport.trackerType === 'EVENT') {
            return `#/enrollmentEventEdit?${buildUrlQueryString({ eventId: uid, orgUnitId })}`;
        }

        return null;
    };
