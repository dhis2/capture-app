import { useSelector } from 'react-redux';
import type { CaptureClientEvent } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { useLocationQuery } from '../../../../utils/routing';
import type { Url } from '../../../../utils/url';
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

type LoadedEvent = {
    eventId?: string;
    programId?: string;
    programStageId?: string;
    enrollmentId?: string;
    teiId?: string;
    isEventProgram: boolean;
};

// Routes carry the event id as either `eventId` (tracker enrollmentEventEdit)
// or `viewEventId` (event-program /viewEvent). Treat both uniformly.
const getUrlEventId = (url: Url): string | undefined =>
    url.eventId ?? url.viewEventId;

const anchorEnrollmentDomain = (
    domain: EnrollmentDomain | undefined,
    url: Url,
): EnrollmentDomain | undefined => {
    if (!domain) return undefined;
    if (url.enrollmentId) {
        return domain.enrollmentId === url.enrollmentId ? domain : undefined;
    }
    const eventId = getUrlEventId(url);
    if (eventId && domain.enrollment?.events?.some(e => e.event === eventId)) {
        return domain;
    }
    return undefined;
};

const resolveLoadedEvent = (
    eventId: string | undefined,
    trackerEvents: Partial<ApiEnrollmentEvent>[] | undefined,
    viewedEvent: Partial<CaptureClientEvent> | undefined,
): LoadedEvent | undefined => {
    if (!eventId) return undefined;
    const tracker = trackerEvents?.find(e => e.event === eventId);
    if (tracker) {
        return {
            eventId: tracker.event,
            programId: tracker.program,
            programStageId: tracker.programStage,
            enrollmentId: tracker.enrollment,
            teiId: tracker.trackedEntity,
            isEventProgram: false,
        };
    }
    if (viewedEvent?.eventId === eventId) {
        return {
            eventId: viewedEvent.eventId,
            programId: viewedEvent.programId,
            programStageId: viewedEvent.programStageId,
            isEventProgram: true,
        };
    }
    return undefined;
};

const resolveNavIds = (url: Url, event: LoadedEvent | undefined) => ({
    programId: url.programId ?? event?.programId,
    eventId: getUrlEventId(url),
});

const resolveTrackerIds = (
    url: Url,
    event: LoadedEvent | undefined,
    enrollment: EnrollmentDomain | undefined,
) => {
    if (event?.isEventProgram) {
        return {
            ownerOrgUnitId: undefined,
            programStageId: undefined,
            enrollmentId: undefined,
            teiId: undefined,
        };
    }
    return {
        ownerOrgUnitId: enrollment?.ownerOrgUnitId,
        programStageId: url.stageId ?? event?.programStageId,
        enrollmentId: url.enrollmentId ?? event?.enrollmentId,
        teiId: url.teiId ?? event?.teiId,
    };
};

const selectViewedEvent = (state: ReduxState, url: Url) =>
    (getUrlEventId(url) ? state.viewEventPage?.loadedValues?.eventContainer?.event : undefined);

export const useFormFieldPluginContext = (): PluginContextIds => {
    const url: Url = useLocationQuery();
    const enrollment = useSelector(
        (state: ReduxState) => anchorEnrollmentDomain(state.enrollmentDomain, url),
    );
    const viewedEvent = useSelector((state: ReduxState) => selectViewedEvent(state, url));
    const event = resolveLoadedEvent(getUrlEventId(url), enrollment?.enrollment?.events, viewedEvent);

    return {
        ...resolveTrackerIds(url, event, enrollment),
        ...resolveNavIds(url, event),
    };
};
