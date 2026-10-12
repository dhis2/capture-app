import log from 'loglevel';
import { useSelector } from 'react-redux';
import { errorCreator, type CaptureClientEvent, type ApiEnrollmentEvent } from 'capture-core-utils';
import { useLocationQuery } from '../../../../utils/routing';
import type { Url } from '../../../../utils/url';
import { programCollection } from '../../../../metaDataMemoryStores';
import { EventProgram, TrackerProgram } from '../../../../metaData';
import type { PluginContextIds } from '../FormFieldPlugin.types';

type EnrollmentDomain = {
    enrollmentId?: string;
    ownerOrgUnitId?: string;
    enrollment?: { events?: Partial<ApiEnrollmentEvent>[] };
};

type ReduxState = {
    enrollmentDomain?: EnrollmentDomain;
    viewEventPage?: {
        loadedValues?: { eventContainer?: { event?: Partial<CaptureClientEvent> } };
    };
};

const selectEnrollment = (state: ReduxState) => state.enrollmentDomain;
const selectViewedEvent = (state: ReduxState) =>
    state.viewEventPage?.loadedValues?.eventContainer?.event;

const resolveEventProgramIds = (
    program: EventProgram,
    programId: string,
    eventId: string | undefined,
): PluginContextIds => ({
    programId,
    programStageId: program.stage?.id,
    eventId,
    ownerOrgUnitId: undefined,
    enrollmentId: undefined,
    teiId: undefined,
});

const resolveTrackerProgramIds = (
    url: Url,
    enrollment: EnrollmentDomain | undefined,
    trackerProgramEvent: Partial<ApiEnrollmentEvent> | undefined,
    programId: string | undefined,
    eventId: string | undefined,
): PluginContextIds => ({
    programId,
    programStageId: url.stageId ?? trackerProgramEvent?.programStage,
    eventId,
    ownerOrgUnitId: enrollment?.ownerOrgUnitId,
    enrollmentId: url.enrollmentId ?? trackerProgramEvent?.enrollment,
    teiId: url.teiId ?? trackerProgramEvent?.trackedEntity,
});

export const useFormFieldPluginContext = (): PluginContextIds => {
    const url: Url = useLocationQuery();
    const eventId = url.eventId ?? url.viewEventId;

    const enrollment = useSelector(selectEnrollment);
    const viewedEvent = useSelector(selectViewedEvent);

    const trackerProgramEvent = enrollment?.enrollment?.events?.find(e => e.event === eventId);
    const programId = url.programId ?? trackerProgramEvent?.program ?? viewedEvent?.programId;
    const program = programId ? programCollection.get(programId) : undefined;

    if (program instanceof EventProgram && programId) {
        return resolveEventProgramIds(program, programId, eventId);
    }
    if (program instanceof TrackerProgram && programId) {
        return resolveTrackerProgramIds(url, enrollment, trackerProgramEvent, programId, eventId);
    }
    log.error(errorCreator('useFormFieldPluginContext: unknown program')({ programId }));
    return {
        programId: undefined,
        programStageId: undefined,
        eventId: undefined,
        ownerOrgUnitId: undefined,
        enrollmentId: undefined,
        teiId: undefined,
    };
};
