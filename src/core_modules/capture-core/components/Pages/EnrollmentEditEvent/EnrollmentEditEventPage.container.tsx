import React, { useCallback, useEffect } from 'react';
import type { ProgramRule } from '@dhis2/rules-engine-javascript';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { dataEntryIds } from 'capture-core/constants';
import { useEnrollmentEditEventPageMode, useHideWidgetByRuleLocations } from '../../../hooks';
import type { ReduxState } from '../../App/withAppUrlSync.types';
import {
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
    setExternalEnrollmentStatus,
    showEnrollmentError,
    updateEnrollmentAndEvents,
    updateEnrollmentEvent,
    useCommonEnrollmentDomainData,
    deleteEnrollmentEvent,
    deleteEnrollmentEventRelationship,
    updateOrAddEnrollmentEvents,
    commitEnrollmentEvents,
    rollbackEnrollmentEvents,
} from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { deleteEnrollment, fetchEnrollments } from '../Enrollment/EnrollmentPage.actions';
import { changeEventFromUrl } from '../ViewEvent/ViewEventComponent/viewEvent.actions';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { convertDateWithTimeForView } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import { useAssignedUserSaveContext, useAssignee, useEvent } from './hooks';
import type { Props } from './EnrollmentEditEventPage.types';
import { LoadingMaskForPage } from '../../LoadingMasks';
import { cleanUpDataEntry } from '../../DataEntry';
import { useLinkedRecordClick } from '../common/TEIRelationshipsWidget';
import { pageKeys } from '../../App/withAppUrlSync';
import { withErrorMessageHandler } from '../../../HOC';
import { DataStoreKeyByPage, useEnrollmentPageLayout } from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import { DefaultPageLayout } from './PageLayout/DefaultPageLayout.constants';
import { getProgramEventAccess, TrackerProgram } from '../../../metaData';
import { rollbackAssignee, setAssignee } from './EnrollmentEditEventPage.actions';
import { convertClientToServer } from '../../../converters';
import { CHANGELOG_ENTITY_TYPES } from '../../WidgetsChangelog';
import { ReactQueryAppNamespace } from '../../../utils/reactQueryHelpers';
import { statusTypes } from '../../../enrollment';
import { cancelEditEventDataEntry } from '../../WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';
import { setCurrentDataEntry } from '../../DataEntry/actions/dataEntry.actions';
import { convertIsoToLocalCalendar } from '../../../utils/converters/date';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import type { UserFormField } from '../../FormFields/UserField';
import type { ProgramStage } from '../../../metaData';

const getEventDate = (event) => {
    const eventDataConvertValue = convertDateWithTimeForView(event?.occurredAt ?? event?.scheduledAt);
    const eventDate = eventDataConvertValue ? eventDataConvertValue.toString() : '';
    return eventDate;
};

const getEventScheduleDate = (event) => {
    if (!event?.scheduledAt) { return undefined; }
    const eventDataConvertValue = convertIsoToLocalCalendar(event?.scheduledAt);
    return eventDataConvertValue?.toString();
};

type PageStatusParams = {
    orgUnitId: string;
    enrollmentSite: Record<string, unknown>;
    teiDisplayName: string;
    trackedEntityName: string;
    programStage?: ProgramStage | null;
    isLoading: boolean;
    event: Record<string, unknown>;
};

const getPageStatus = ({
    orgUnitId, enrollmentSite, teiDisplayName, trackedEntityName, programStage, isLoading, event,
}: PageStatusParams) => {
    if (isLoading) {
        return pageStatuses.LOADING;
    }
    if (orgUnitId) {
        return enrollmentSite && teiDisplayName && trackedEntityName && programStage && event
            ? pageStatuses.DEFAULT
            : pageStatuses.MISSING_DATA;
    }
    return pageStatuses.WITHOUT_ORG_UNIT_SELECTED;
};

export const EnrollmentEditEventPage = () => {
    const { navigate } = useNavigate();
    const dispatch = useDispatch();

    const eventId = useSelector((state: ReduxState) => state.viewEventPage.eventId);
    const error = useSelector((state: ReduxState) => state.activePage.viewEventLoadError?.error);
    const { loading, event } = useEvent(eventId ?? '');
    const { program: programId, programStage: stageId, trackedEntity: teiId, enrollment: enrollmentId } = event;
    const { orgUnitId, eventId: urlEventId, initMode } = useLocationQuery();
    const enrollmentSite = useCommonEnrollmentDomainData(teiId, enrollmentId, programId).enrollment;
    const storedEvent = enrollmentSite?.events?.find((item: Record<string, unknown>) => item.event === eventId);

    useEffect(() => {
        if (!urlEventId) {
            navigate(`/?${buildUrlQueryString({ orgUnitId })}`);
        } else if (eventId !== urlEventId) {
            dispatch(changeEventFromUrl(urlEventId, pageKeys.ENROLLMENT_EVENT));
        }
    }, [dispatch, navigate, eventId, urlEventId, orgUnitId]);

    return ((!loading && eventId === urlEventId) || error) && storedEvent ? (
        <EnrollmentEditEventPageWithContext
            programId={programId}
            stageId={stageId}
            teiId={teiId}
            enrollmentId={enrollmentId}
            orgUnitId={orgUnitId}
            initMode={initMode}
            enrollmentSite={enrollmentSite}
            event={storedEvent}
        />
    ) : <LoadingMaskForPage />;
};

const EnrollmentEditEventPageWithContextPlain = ({
    programId,
    stageId,
    teiId,
    enrollmentId,
    orgUnitId,
    initMode,
    enrollmentSite,
    event,
}: Props) => {
    const { navigate } = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { pageLayout, isLoading } = useEnrollmentPageLayout({
        selectedScopeId: programId,
        dataStoreKey: DataStoreKeyByPage.ENROLLMENT_EVENT_EDIT,
        defaultPageLayout: DefaultPageLayout,
    });
    const { event: eventId } = event;

    const { onLinkedRecordClick } = useLinkedRecordClick();

    useEffect(() => () => {
        dispatch(cleanUpDataEntry(dataEntryIds.ENROLLMENT_EVENT));
    }, [dispatch]);

    const { program } = useProgramInfo(programId);
    const programStage = [...program?.stages?.values() ?? []].find((item: any) => item.id === stageId);
    const hideWidgets = useHideWidgetByRuleLocations(
        program?.programRules.concat(programStage?.programRules as ProgramRule[]),
    );

    const onDeleteTrackedEntitySuccess = useCallback(() => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }, [navigate, orgUnitId, programId]);

    const onBackToMainPage = useCallback(() => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }, [navigate, orgUnitId, programId]);

    const onDelete = () => {
        navigate(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onEnrollmentError = (message: string) => dispatch(showEnrollmentError({ message }));
    const onEnrollmentSuccess = () => dispatch(fetchEnrollments());

    const onUpdateEnrollmentStatus = useCallback((enrollmentToUpdate: Record<string, unknown>) => {
        dispatch(updateEnrollmentAndEvents(enrollmentToUpdate));
    }, [dispatch]);

    const onUpdateEnrollmentStatusError = useCallback((message: string) => {
        dispatch(rollbackEnrollmentAndEvents());
        dispatch(showEnrollmentError({ message }));
    }, [dispatch]);

    const onUpdateEnrollmentStatusSuccess = useCallback(({ redirect }: { redirect?: boolean }) => {
        dispatch(commitEnrollmentAndEvents());
        redirect && navigate(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [dispatch, navigate, programId, orgUnitId, teiId, enrollmentId]);

    const onDeleteEvent = useCallback((linkedEventId: string) => {
        dispatch(deleteEnrollmentEvent(linkedEventId));
    }, [dispatch]);

    const onDeleteEventRelationship = useCallback((relationshipId: string) => {
        dispatch(deleteEnrollmentEventRelationship(relationshipId));
    }, [dispatch]);

    const onUpdateOrAddEnrollmentEvents = useCallback((events: Array<Record<string, unknown>>) => {
        dispatch(updateOrAddEnrollmentEvents({ events }));
    }, [dispatch]);

    const onUpdateEnrollmentEventsSuccess = useCallback((events: Array<Record<string, unknown>>) => {
        dispatch(commitEnrollmentEvents({ events }));
    }, [dispatch]);

    const onUpdateEnrollmentEventsError = useCallback((events: Array<Record<string, unknown>>) => {
        dispatch(rollbackEnrollmentEvents({ events }));
    }, [dispatch]);

    const onSaveAndCompleteEnrollment = useCallback((enrollmentToUpdate: Record<string, unknown>) => {
        dispatch(setExternalEnrollmentStatus(statusTypes.COMPLETED));
        dispatch(updateEnrollmentAndEvents(enrollmentToUpdate));
        navigate(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [dispatch, navigate, programId, orgUnitId, teiId, enrollmentId]);

    const onAddNew = () => {
        navigate(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };

    const onCancelEditEvent = useCallback((isScheduled: boolean) => {
        if (isScheduled) {
            navigate(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);
        }
        if (initMode) {
            navigate(`/enrollmentEventEdit?${buildUrlQueryString({ eventId, orgUnitId })}`);
        }
    }, [initMode, enrollmentId, eventId, orgUnitId, navigate]);

    const onGoBack = () =>
        navigate(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);

    const onNavigateToEvent = (eventIdToRedirectTo: string) => {
        navigate(
            `/enrollmentEventEdit?${buildUrlQueryString({
                eventId: eventIdToRedirectTo,
                orgUnitId,
                programId,
                enrollmentId,
            })}`,
        );
    };

    const onHandleScheduleSave = useCallback((eventData: Record<string, unknown>) => {
        dispatch(updateEnrollmentEvent(eventId, eventData));
        navigate(`enrollment?${buildUrlQueryString({ enrollmentId })}`);
    }, [dispatch, navigate, enrollmentId, eventId]);

    const onSaveExternal = useCallback(() => {
        const queryKey = [ReactQueryAppNamespace, 'changelog', CHANGELOG_ENTITY_TYPES.EVENT, eventId];
        queryClient.removeQueries(queryKey);
        navigate(`enrollment?${buildUrlQueryString({ enrollmentId })}`);
    }, [navigate, enrollmentId, eventId, queryClient]);

    const onBackToViewEvent = () => {
        dispatch(cancelEditEventDataEntry());
        dispatch(setCurrentDataEntry(dataEntryIds.ENROLLMENT_EVENT, pageKeys.VIEW_EVENT));
    };

    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    const trackedEntityType = (program && program instanceof TrackerProgram) ? program.trackedEntityType : undefined;
    const { name: trackedEntityName = '', id: trackedEntityTypeId = '' } = trackedEntityType ?? {};
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite ?? {}], programId);
    const eventDate = getEventDate(event);
    const scheduleDate = getEventScheduleDate(event);
    const { currentPageMode } = useEnrollmentEditEventPageMode(event?.status);
    const dataEntryKey = `${dataEntryIds.ENROLLMENT_EVENT}-${currentPageMode}`;
    const userInteractionInProgress = useSelector(state => dataEntryHasChanges(state, dataEntryKey));

    const outputEffects = useWidgetDataFromStore(dataEntryKey);
    const eventAccess = getProgramEventAccess(programId, programStage?.id ?? null);


    const pageStatus = getPageStatus({
        orgUnitId,
        enrollmentSite,
        teiDisplayName,
        trackedEntityName,
        programStage,
        event,
        isLoading,
    });
    const assignee = useAssignee(event);
    const getAssignedUserSaveContext = useAssignedUserSaveContext(event);
    const onSaveAssignee = (newAssignee: UserFormField) => {
        const assignedUser = convertClientToServer(newAssignee, dataElementTypes.ASSIGNEE);
        dispatch(setAssignee(assignedUser, newAssignee, eventId));
    };
    const onAccessLostFromTransfer = () => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    };
    const onSaveAssigneeError = (prevAssignee: UserFormField | null) => {
        const assignedUser = prevAssignee
            ? convertClientToServer(prevAssignee, dataElementTypes.ASSIGNEE)
            : undefined;
        dispatch(rollbackAssignee(assignedUser, prevAssignee, eventId));
    };

    if (pageStatus === pageStatuses.LOADING) {
        return <LoadingMaskForPage />;
    }

    return (
        <EnrollmentEditEventPageComponent
            pageLayout={pageLayout}
            mode={currentPageMode}
            pageStatus={pageStatus}
            programStage={programStage}
            onBackToMainPage={onBackToMainPage}
            onBackToDashboard={onGoBack}
            onBackToViewEvent={onBackToViewEvent}
            widgetEffects={outputEffects}
            hideWidgets={hideWidgets}
            teiId={teiId}
            enrollmentId={enrollmentId}
            eventId={eventId}
            stageId={stageId}
            trackedEntityTypeId={trackedEntityTypeId}
            enrollmentsAsOptions={enrollmentsAsOptions}
            teiDisplayName={teiDisplayName}
            trackedEntityName={trackedEntityName}
            program={program}
            onDelete={onDelete}
            onDeleteTrackedEntitySuccess={onDeleteTrackedEntitySuccess}
            onAddNew={onAddNew}
            orgUnitId={orgUnitId}
            eventDate={eventDate}
            assignee={assignee}
            onLinkedRecordClick={onLinkedRecordClick}
            onEnrollmentError={onEnrollmentError}
            onEnrollmentSuccess={onEnrollmentSuccess}
            onUpdateEnrollmentStatus={onUpdateEnrollmentStatus}
            onUpdateEnrollmentStatusSuccess={onUpdateEnrollmentStatusSuccess}
            onUpdateEnrollmentStatusError={onUpdateEnrollmentStatusError}
            onSaveAndCompleteEnrollment={onSaveAndCompleteEnrollment}
            eventStatus={event?.status}
            eventAccess={eventAccess}
            scheduleDate={scheduleDate}
            onCancelEditEvent={onCancelEditEvent}
            onHandleScheduleSave={onHandleScheduleSave}
            onSaveExternal={onSaveExternal}
            getAssignedUserSaveContext={getAssignedUserSaveContext}
            onSaveAssignee={onSaveAssignee}
            onSaveAssigneeError={onSaveAssigneeError}
            events={enrollmentSite?.events}
            onAccessLostFromTransfer={onAccessLostFromTransfer}
            onNavigateToEvent={onNavigateToEvent}
            onDeleteEvent={onDeleteEvent}
            onDeleteEventRelationship={onDeleteEventRelationship}
            onUpdateOrAddEnrollmentEvents={onUpdateOrAddEnrollmentEvents}
            onUpdateEnrollmentEventsSuccess={onUpdateEnrollmentEventsSuccess}
            onUpdateEnrollmentEventsError={onUpdateEnrollmentEventsError}
            userInteractionInProgress={userInteractionInProgress}
        />
    );
};

const EnrollmentEditEventPageWithContext = withErrorMessageHandler()(EnrollmentEditEventPageWithContextPlain);
