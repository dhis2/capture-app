// @flow
import React, { useEffect, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { dataEntryIds } from 'capture-core/constants';
import { useEnrollmentEditEventPageMode } from 'capture-core/hooks';
import {
    useCommonEnrollmentDomainData,
    showEnrollmentError,
    updateEnrollmentEvent,
    updateEnrollmentAndEvents,
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
    setExternalEnrollmentStatus,
} from '../common/EnrollmentOverviewDomain';
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import { EnrollmentEditEventPageComponent } from './EnrollmentEditEventPage.component';
import { useWidgetDataFromStore } from '../EnrollmentAddEvent/hooks';
import { useHideWidgetByRuleLocations } from '../Enrollment/EnrollmentPageDefault/hooks';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { deleteEnrollment, fetchEnrollments } from '../Enrollment/EnrollmentPage.actions';
import { changeEventFromUrl } from '../ViewEvent/ViewEventComponent/viewEvent.actions';
import { buildEnrollmentsAsOptions } from '../../ScopeSelector';
import { convertDateWithTimeForView, convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import { useEvent, useAssignee, useAssignedUserSaveContext } from './hooks';
import type { Props } from './EnrollmentEditEventPage.types';
import { LoadingMaskForPage } from '../../LoadingMasks';
import { cleanUpDataEntry } from '../../DataEntry';
import { useLinkedRecordClick } from '../common/TEIRelationshipsWidget';
import { pageKeys } from '../../App/withAppUrlSync';
import { withErrorMessageHandler } from '../../../HOC';
import {
    useEnrollmentPageLayout,
} from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout/hooks/useEnrollmentPageLayout';
import { DataStoreKeyByPage } from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import { DefaultPageLayout } from './PageLayout/DefaultPageLayout.constants';
import { getProgramEventAccess } from '../../../metaData';
import { setAssignee, rollbackAssignee } from './EnrollmentEditEventPage.actions';
import { convertClientToServer } from '../../../converters';
import { CHANGELOG_ENTITY_TYPES } from '../../WidgetsChangelog';
import { ReactQueryAppNamespace } from '../../../utils/reactQueryHelpers';
import { statusTypes } from '../../../enrollment';

const getEventDate = (event) => {
    const eventDataConvertValue = convertDateWithTimeForView(event?.occurredAt || event?.scheduledAt);
    const eventDate = eventDataConvertValue ? eventDataConvertValue.toString() : '';
    return eventDate;
};

const getEventScheduleDate = (event) => {
    if (!event?.scheduledAt) { return undefined; }
    const eventDataConvertValue = convertValue(event?.scheduledAt, dataElementTypes.DATETIME);
    return eventDataConvertValue?.toString();
};

const getPageStatus = ({ orgUnitId, enrollmentSite, teiDisplayName, trackedEntityName, programStage, isLoading, event }) => {
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
    const history = useHistory();
    const dispatch = useDispatch();

    const eventId = useSelector(({ viewEventPage }) => viewEventPage.eventId);
    const error = useSelector(({ activePage }) => activePage.viewEventLoadError?.error);
    const { loading, event } = useEvent(eventId);
    const { program: programId, programStage: stageId, trackedEntity: teiId, enrollment: enrollmentId } = event;
    const { orgUnitId, eventId: urlEventId, initMode } = useLocationQuery();
    const enrollmentSite = useCommonEnrollmentDomainData(teiId, enrollmentId, programId).enrollment;
    const storedEvent = enrollmentSite?.events?.find(item => item.event === eventId);

    useEffect(() => {
        if (!urlEventId) {
            // return to main page
            history.push(`/?${buildUrlQueryString({ orgUnitId })}`);
        } else if (eventId !== urlEventId) {
            dispatch(changeEventFromUrl(urlEventId, pageKeys.ENROLLMENT_EVENT));
        }
    }, [dispatch, history, eventId, urlEventId, orgUnitId]);

    return ((!loading && eventId === urlEventId) || error) && storedEvent ? (
        <EnrollmentEditEventPageWithContext
            programId={programId}
            stageId={stageId}
            teiId={teiId}
            enrollmentId={enrollmentId}
            orgUnitId={orgUnitId}
            error={error}
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
    const history = useHistory();
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
    const programStage = [...program.stages?.values()].find(item => item.id === stageId);
    const hideWidgets = useHideWidgetByRuleLocations(program.programRules.concat(programStage?.programRules));

    const onDeleteTrackedEntitySuccess = useCallback(() => {
        history.push(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }, [history, orgUnitId, programId]);

    const onDelete = () => {
        history.push(`/enrollment?${buildUrlQueryString({ orgUnitId, programId, teiId })}`);
        dispatch(deleteEnrollment({ enrollmentId }));
    };
    const onEnrollmentError = message => dispatch(showEnrollmentError({ message }));
    const onEnrollmentSuccess = () => dispatch(fetchEnrollments());

    const onUpdateEnrollmentStatus = useCallback((enrollmentToUpdate) => {
        dispatch(updateEnrollmentAndEvents(enrollmentToUpdate));
    }, [dispatch]);

    const onUpdateEnrollmentStatusError = useCallback((message) => {
        dispatch(rollbackEnrollmentAndEvents());
        dispatch(showEnrollmentError({ message }));
    }, [dispatch]);

    const onUpdateEnrollmentStatusSuccess = useCallback(({ redirect }) => {
        dispatch(commitEnrollmentAndEvents());
        redirect && history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [dispatch, history, programId, orgUnitId, teiId, enrollmentId]);

    const onSaveAndCompleteEnrollment = useCallback((enrollmentToUpdate) => {
        dispatch(setExternalEnrollmentStatus(statusTypes.COMPLETED));
        dispatch(updateEnrollmentAndEvents(enrollmentToUpdate));
        history.push(`enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
    }, [dispatch, history, programId, orgUnitId, teiId, enrollmentId]);

    const onAddNew = () => {
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    };
    const onCancelEditEvent = useCallback((isScheduled: boolean) => {
        if (isScheduled) {
            history.push(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);
        }
        if (initMode) {
            history.push(`/enrollmentEventEdit?${buildUrlQueryString({ eventId, orgUnitId })}`);
        }
    }, [initMode, enrollmentId, eventId, orgUnitId, history]);

    const onGoBack = () =>
        history.push(`/enrollment?${buildUrlQueryString({ enrollmentId })}`);

    const onHandleScheduleSave = (eventData: Object) => {
        dispatch(updateEnrollmentEvent(eventId, eventData));
        history.push(`enrollment?${buildUrlQueryString({ enrollmentId })}`);
    };

    const onSaveExternal = () => {
        const queryKey = [ReactQueryAppNamespace, 'changelog', CHANGELOG_ENTITY_TYPES.EVENT, eventId];
        queryClient.removeQueries(queryKey);
        history.push(`enrollment?${buildUrlQueryString({ enrollmentId })}`);
    };

    const { teiDisplayName } = useTeiDisplayName(teiId, programId);
    // $FlowFixMe
    const { name: trackedEntityName, id: trackedEntityTypeId } = program?.trackedEntityType;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions([enrollmentSite || {}], programId);
    const eventDate = getEventDate(event);
    const scheduleDate = getEventScheduleDate(event);
    const { currentPageMode } = useEnrollmentEditEventPageMode(event?.status);
    const dataEntryKey = `${dataEntryIds.ENROLLMENT_EVENT}-${currentPageMode}`;
    const outputEffects = useWidgetDataFromStore(dataEntryKey);
    const eventAccess = getProgramEventAccess(programId, programStage?.id);


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
    const onSaveAssignee = (newAssignee) => {
        // $FlowFixMe dataElementTypes flow error
        const assignedUser: ApiAssignedUser = convertClientToServer(newAssignee, dataElementTypes.ASSIGNEE);
        dispatch(setAssignee(assignedUser, newAssignee, eventId));
    };
    const onAccessLostFromTransfer = () => {
        history.push(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    };
    const onSaveAssigneeError = (prevAssignee) => {
        const assignedUser: ApiAssignedUser | typeof undefined = prevAssignee
            // $FlowFixMe dataElementTypes flow error
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
            onGoBack={onGoBack}
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
        />
    );
};

const EnrollmentEditEventPageWithContext = withErrorMessageHandler()(EnrollmentEditEventPageWithContextPlain);
