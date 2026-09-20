import { useSelector } from 'react-redux';
import { useLocationQuery } from '../../../../utils/routing';
import type { PluginContext, PluginContextIds } from '../FormFieldPlugin.types';

type EnrollmentEvent = {
    event: string;
    program?: string;
    programStage?: string;
    enrollment?: string;
    orgUnit?: string;
    trackedEntity?: string;
};

type ReduxStateSlice = {
    enrollmentDomain?: {
        ownerOrgUnitId?: string;
        enrollment?: {
            events?: EnrollmentEvent[];
            trackedEntity?: string;
        };
    };
    viewEventPage?: { eventId?: string };
    currentSelections?: { programId?: string };
};

type OrgUnitSources = {
    formOrgUnitId?: string;
    eventOrgUnitId?: string;
    urlOrgUnitId?: string;
    ownerOrgUnitId?: string;
};

const resolveOrgUnitId = (isEventContext: boolean, sources: OrgUnitSources) => {
    if (sources.ownerOrgUnitId && !isEventContext) return sources.ownerOrgUnitId;
    return sources.formOrgUnitId ?? sources.eventOrgUnitId ?? sources.urlOrgUnitId;
};

export const useFormFieldPluginContext = (pluginContext: PluginContext = {}): PluginContextIds => {
    const {
        orgUnitId: urlOrgUnitId,
        programId: urlProgramId,
        stageId: urlStageId,
        enrollmentId: urlEnrollmentId,
        eventId: urlEventId,
        teiId: urlTeiId,
    } = useLocationQuery();

    const ownerOrgUnitId = useSelector(
        ({ enrollmentDomain }: ReduxStateSlice) => enrollmentDomain?.ownerOrgUnitId,
    );
    const enrollmentFromRedux = useSelector(
        ({ enrollmentDomain }: ReduxStateSlice) => enrollmentDomain?.enrollment,
    );
    const eventIdFromRedux = useSelector(
        ({ viewEventPage }: ReduxStateSlice) => viewEventPage?.eventId,
    );
    const currentSelectionsProgramId = useSelector(
        ({ currentSelections }: ReduxStateSlice) => currentSelections?.programId,
    );

    const eventId = urlEventId ?? eventIdFromRedux;
    const eventFromRedux = enrollmentFromRedux?.events?.find(e => e.event === eventId);
    const programStageId = urlStageId ?? eventFromRedux?.programStage;

    return {
        orgUnitId: resolveOrgUnitId(Boolean(programStageId || eventId), {
            formOrgUnitId: (pluginContext.orgUnit?.value as { id?: string } | undefined)?.id,
            eventOrgUnitId: eventFromRedux?.orgUnit,
            urlOrgUnitId,
            ownerOrgUnitId,
        }),
        programId: urlProgramId ?? eventFromRedux?.program ?? currentSelectionsProgramId,
        programStageId,
        enrollmentId: urlEnrollmentId ?? eventFromRedux?.enrollment,
        eventId,
        teiId: urlTeiId ?? eventFromRedux?.trackedEntity ?? enrollmentFromRedux?.trackedEntity,
    };
};
