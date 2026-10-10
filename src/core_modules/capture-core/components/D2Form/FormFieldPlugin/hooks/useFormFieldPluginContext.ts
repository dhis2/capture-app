import { useSelector } from 'react-redux';
import type { CaptureClientEvent } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { useLocationQuery } from '../../../../utils/routing';
import type { PluginContext, PluginContextIds } from '../FormFieldPlugin.types';

type EnrollmentDomain = {
    enrollmentId?: string;
    ownerOrgUnitId?: string;
    enrollment?: { events?: Partial<ApiEnrollmentEvent>[] };
};

type ReduxState = {
    enrollmentDomain?: EnrollmentDomain;
    viewEventPage?: {
        eventId?: string;
        loadedValues?: { eventContainer?: { event?: Partial<CaptureClientEvent> } };
    };
};

type Event = {
    eventId?: string;
    programId?: string;
    orgUnitId?: string;
    programStageId?: string;
    enrollmentId?: string;
    teiId?: string;
    isEventProgram: boolean;
};

type UrlIds = ReturnType<typeof useLocationQuery>;

// Accept enrollmentDomain only when the URL belongs to it: either anchored by
// enrollmentId, or (for enrollmentEventEdit which only carries eventId) when
// the slice owns the URL's event. Keeps us from reading stale enrollment data
// after the user navigates away.
const anchorEnrollmentDomain = (
    state: ReduxState,
    url: UrlIds,
): EnrollmentDomain | undefined => {
    const domain = state.enrollmentDomain;
    if (!domain) return undefined;
    if (url.enrollmentId) {
        return domain.enrollmentId === url.enrollmentId ? domain : undefined;
    }
    if (url.eventId && domain.enrollment?.events?.some(e => e.event === url.eventId)) {
        return domain;
    }
    return undefined;
};

// Normalize whichever slice owns the eventId into one shape. Event programs
// have an implicit single stage and no enrollment/TEI — intentionally left
// undefined so downstream code treats them as tracker-only misses, not bugs.
const findEvent = (
    eventId: string | undefined,
    trackerEvents: Partial<ApiEnrollmentEvent>[] | undefined,
    viewedEvent: Partial<CaptureClientEvent> | undefined,
): Event | undefined => {
    const tracker = trackerEvents?.find(e => e.event === eventId);
    if (tracker) {
        return {
            eventId: tracker.event,
            programId: tracker.program,
            orgUnitId: tracker.orgUnit,
            programStageId: tracker.programStage,
            enrollmentId: tracker.enrollment,
            teiId: tracker.trackedEntity,
            isEventProgram: false,
        };
    }
    if (viewedEvent && viewedEvent.eventId === eventId) {
        return {
            eventId: viewedEvent.eventId,
            programId: viewedEvent.programId,
            orgUnitId: viewedEvent.orgUnitId,
            isEventProgram: true,
        };
    }
    return undefined;
};

// In an event context the form's own org unit widget wins; outside it we fall
// back to the enrollment's owner.
const resolveOrgUnit = (
    inEventContext: boolean,
    formOrgUnitId: string | undefined,
    eventOrgUnitId: string | undefined,
    ownerOrgUnitId: string | undefined,
) => (inEventContext ? formOrgUnitId ?? eventOrgUnitId : ownerOrgUnitId);

// Tracker-only ids (enrollment/TEI) are forced to undefined on event programs
// so plugin code doesn't see stale values.
const trackerKey = (
    isEventProgram: boolean,
    urlValue: string | undefined,
    eventValue: string | undefined,
) => (isEventProgram ? undefined : urlValue ?? eventValue);

const buildIds = (
    url: UrlIds,
    event: Event | undefined,
    enrollment: EnrollmentDomain | undefined,
    formOrgUnitId: string | undefined,
): PluginContextIds => {
    const eventId = url.eventId ?? event?.eventId;
    const programStageId = url.stageId ?? event?.programStageId;
    const inEventContext = Boolean(eventId || programStageId);
    const noTracker = event?.isEventProgram ?? false;

    return {
        orgUnitId: resolveOrgUnit(inEventContext, formOrgUnitId, event?.orgUnitId, enrollment?.ownerOrgUnitId),
        programId: url.programId ?? event?.programId,
        programStageId,
        eventId,
        enrollmentId: trackerKey(noTracker, url.enrollmentId, event?.enrollmentId),
        teiId: trackerKey(noTracker, url.teiId, event?.teiId),
    };
};

export const useFormFieldPluginContext = (
    pluginContext: PluginContext = {},
): PluginContextIds => {
    const url = useLocationQuery();
    const enrollment = useSelector((state: ReduxState) => anchorEnrollmentDomain(state, url));
    const viewedEventId = useSelector((state: ReduxState) => state.viewEventPage?.eventId);
    const viewedEvent = useSelector(
        (state: ReduxState) => state.viewEventPage?.loadedValues?.eventContainer?.event,
    );
    const event = findEvent(
        url.eventId ?? viewedEventId,
        enrollment?.enrollment?.events,
        viewedEvent,
    );
    return buildIds(url, event, enrollment, pluginContext.orgUnit?.value?.id);
};
