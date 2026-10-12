import { useSelector } from 'react-redux';
import type { CaptureClientEvent, ApiEnrollmentEvent } from 'capture-core-utils';
import { useLocationQuery } from '../../../../utils/routing';
import type { Url } from '../../../../utils/url';
import { programCollection } from '../../../../metaDataMemoryStores';
import { EventProgram, type Program } from '../../../../metaData';
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

type TrackerProgramEvent = Partial<ApiEnrollmentEvent>;

const enrollmentMatchesRoute = (
    domain: EnrollmentDomain | undefined,
    url: Url,
    eventId: string | undefined,
): boolean => {
    if (!domain) return false;
    if (url.enrollmentId) return domain.enrollmentId === url.enrollmentId;
    if (eventId) return !!domain.enrollment?.events?.some(e => e.event === eventId);
    return false;
};

const resolveNavIds = (
    url: Url,
    trackerProgramEvent: TrackerProgramEvent | undefined,
    eventId: string | undefined,
    programId: string | undefined,
    program: Program | undefined,
) => ({
    programId,
    programStageId: program instanceof EventProgram
        ? program.stage?.id
        : url.stageId ?? trackerProgramEvent?.programStage,
    eventId,
});

const resolveTrackerIds = (
    url: Url,
    trackerProgramEvent: TrackerProgramEvent | undefined,
    enrollment: EnrollmentDomain | undefined,
    program: Program | undefined,
) => {
    if (program instanceof EventProgram) {
        return { ownerOrgUnitId: undefined, enrollmentId: undefined, teiId: undefined };
    }
    return {
        ownerOrgUnitId: enrollment?.ownerOrgUnitId,
        enrollmentId: url.enrollmentId ?? trackerProgramEvent?.enrollment,
        teiId: url.teiId ?? trackerProgramEvent?.trackedEntity,
    };
};

export const useFormFieldPluginContext = (): PluginContextIds => {
    const url: Url = useLocationQuery();
    const eventId = url.eventId ?? url.viewEventId;

    const enrollment = useSelector((state: ReduxState) =>
        (enrollmentMatchesRoute(state.enrollmentDomain, url, eventId) ? state.enrollmentDomain : undefined),
    );
    const eventProgramEvent = useSelector((state: ReduxState) =>
        (eventId ? state.viewEventPage?.loadedValues?.eventContainer?.event : undefined),
    );

    const trackerProgramEvent = enrollment?.enrollment?.events?.find(e => e.event === eventId);
    const programId = url.programId ?? trackerProgramEvent?.program ?? eventProgramEvent?.programId;
    const program = programId ? programCollection.get(programId) : undefined;

    return {
        ...resolveNavIds(url, trackerProgramEvent, eventId, programId, program),
        ...resolveTrackerIds(url, trackerProgramEvent, enrollment, program),
    };
};
