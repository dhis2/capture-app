import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../../../../../metaData';
import { buildUrlQueryString } from '../../../../../utils/routing';

type ErrorReport = {
    uid?: string;
    trackerType?: 'ENROLLMENT' | 'EVENT' | string;
};

export const getRecordUrlFromErrorReport = ({
    errorReport,
    programId,
    orgUnitId,
    enrollmentIdToTeiId,
}: {
    errorReport: ErrorReport;
    programId?: string;
    orgUnitId?: string;
    enrollmentIdToTeiId?: Record<string, string>;
}): string | null => {
    if (!errorReport.uid || !programId || !orgUnitId) {
        return null;
    }

    if (errorReport.trackerType === 'ENROLLMENT') {
        const teiId = enrollmentIdToTeiId?.[errorReport.uid];
        if (!teiId) {
            return null;
        }
        return `#/enrollment?${buildUrlQueryString({
            teiId,
            programId,
            orgUnitId,
            enrollmentId: errorReport.uid,
        })}`;
    }

    try {
        const program = getProgramFromProgramIdThrowIfNotFound(programId);
        if (program instanceof EventProgram) {
            return `#/viewEvent?${buildUrlQueryString({ viewEventId: errorReport.uid, orgUnitId })}`;
        }
        return `#/enrollmentEventEdit?${buildUrlQueryString({ eventId: errorReport.uid, orgUnitId })}`;
    } catch (error) {
        log.error(errorCreator('Could not build record URL for error report')({ error, programId }));
        return null;
    }
};
