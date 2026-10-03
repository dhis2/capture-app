import { useSelector } from 'react-redux';
import type { CaptureClientEvent } from 'capture-core-utils';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { useLocationQuery } from '../../../../utils/routing';
import type { PluginContext, PluginContextIds } from '../FormFieldPlugin.types';

type ReduxState = {
    enrollmentDomain?: {
        enrollmentId?: string;
        ownerOrgUnitId?: string;
        enrollment?: { events?: Partial<ApiEnrollmentEvent>[] };
    };
    viewEventPage?: {
        eventId?: string;
        loadedValues?: { eventContainer?: { event?: Partial<CaptureClientEvent> } };
    };
};

// Normalize either event shape (server API vs capture-app client) to a single
// shape so the merge step doesn't have to care which slice it came from.
type ResolvedEvent = Partial<PluginContextIds> & { isEventProgram: boolean };

const asTracker = (e: Partial<ApiEnrollmentEvent>): ResolvedEvent => ({
    eventId: e.event,
    programId: e.program,
    programStageId: e.programStage,
    orgUnitId: e.orgUnit,
    enrollmentId: e.enrollment,
    teiId: e.trackedEntity,
    isEventProgram: false,
});

const asEventProgram = (e: Partial<CaptureClientEvent>): ResolvedEvent => ({
    eventId: e.eventId,
    programId: e.programId,
    orgUnitId: e.orgUnitId,
    // Event programs technically have a single implicit stage, but that
    // detail is not user-facing — don't expose it. Same for enrollment / TEI
    // which don't exist on event programs at all.
    programStageId: undefined,
    enrollmentId: undefined,
    teiId: undefined,
    isEventProgram: true,
});

const pickEvent = (
    eventId: string | undefined,
    trackerEvents: Partial<ApiEnrollmentEvent>[] | undefined,
    viewed: Partial<CaptureClientEvent> | undefined,
): ResolvedEvent | undefined => {
    const trackerEvent = trackerEvents?.find(e => e.event === eventId);
    if (trackerEvent) {
        return asTracker(trackerEvent);
    }
    if (viewed && viewed.eventId === eventId) {
        return asEventProgram(viewed);
    }
    return undefined;
};

// Small per-field mergers keep the caller's cyclomatic complexity low.
const resolveOrgUnitId = (
    inEventContext: boolean,
    formOrgUnitId: string | undefined,
    eventOrgUnitId: string | undefined,
    ownerOrgUnitId: string | undefined,
) => (inEventContext ? formOrgUnitId ?? eventOrgUnitId : ownerOrgUnitId);

const resolveTrackerOnly = (
    isEventProgram: boolean,
    urlValue: string | undefined,
    eventValue: string | undefined,
) => (isEventProgram ? undefined : urlValue ?? eventValue);

type UrlIds = ReturnType<typeof useLocationQuery>;

const merge = (
    url: UrlIds,
    event: ResolvedEvent | undefined,
    ownerOrgUnitId: string | undefined,
    formOrgUnitId: string | undefined,
): PluginContextIds => {
    const eventId = url.eventId ?? event?.eventId;
    const programStageId = url.stageId ?? event?.programStageId;
    const inEventContext = Boolean(programStageId || eventId);
    const isEventProgram = event?.isEventProgram ?? false;

    return {
        orgUnitId: resolveOrgUnitId(inEventContext, formOrgUnitId, event?.orgUnitId, ownerOrgUnitId),
        programId: url.programId ?? event?.programId,
        programStageId,
        eventId,
        enrollmentId: resolveTrackerOnly(isEventProgram, url.enrollmentId, event?.enrollmentId),
        teiId: resolveTrackerOnly(isEventProgram, url.teiId, event?.teiId),
    };
};

export const useFormFieldPluginContext = (
    pluginContext: PluginContext = {},
): PluginContextIds => {
    const url = useLocationQuery();
    // Gate enrollmentDomain by URL anchor — same pattern as useEnrollmentScopeRuleEffects.
    const enrollment = useSelector(({ enrollmentDomain }: ReduxState) =>
        (enrollmentDomain?.enrollmentId === url.enrollmentId ? enrollmentDomain : undefined));
    const viewedEventId = useSelector(({ viewEventPage }: ReduxState) => viewEventPage?.eventId);
    const viewedEvent = useSelector(
        ({ viewEventPage }: ReduxState) => viewEventPage?.loadedValues?.eventContainer?.event,
    );

    const event = pickEvent(
        url.eventId ?? viewedEventId,
        enrollment?.enrollment?.events,
        viewedEvent,
    );

    return merge(url, event, enrollment?.ownerOrgUnitId, pluginContext.orgUnit?.value?.id);
};
