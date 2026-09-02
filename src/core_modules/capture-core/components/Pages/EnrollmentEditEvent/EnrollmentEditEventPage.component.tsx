import React from 'react';
import { dataEntryIds } from 'capture-core/constants';
import type { PlainProps } from './EnrollmentEditEventPage.types';
import { useTermLabel } from '../../../metaData';
import { customTerms } from '../../../utils/customTerms';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';
import { TopBar } from './TopBar.container';
import { NoticeBox } from '../../NoticeBox';
import { EnrollmentPageLayout } from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout';
import { WidgetsForEnrollmentEventEdit } from './PageLayout/DefaultPageLayout.constants';
import {
    EnrollmentPageKeys,
} from '../common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';
import { actionTypes } from './EnrollmentEditEventPage.actions';

export const EnrollmentEditEventPageComponent = ({
    pageLayout,
    mode,
    programStage,
    teiId,
    enrollmentId,
    eventId,
    stageId,
    trackedEntityTypeId,
    program,
    enrollmentsAsOptions,
    trackedEntityName,
    teiDisplayName,
    widgetEffects,
    hideWidgets,
    onDelete,
    onAddNew,
    onLinkedRecordClick,
    orgUnitId,
    eventDate,
    scheduleDate,
    eventStatus,
    eventAccess,
    assignee,
    pageStatus,
    events,
    onBackToDashboard,
    onBackToMainPage,
    onBackToViewEvent,
    onEnrollmentError,
    onEnrollmentSuccess,
    onUpdateEnrollmentStatus,
    onUpdateEnrollmentStatusError,
    onUpdateEnrollmentStatusSuccess,
    onSaveAndCompleteEnrollment,
    onCancelEditEvent,
    onHandleScheduleSave,
    onSaveExternal,
    getAssignedUserSaveContext,
    onSaveAssignee,
    onSaveAssigneeError,
    onDeleteTrackedEntitySuccess,
    onAccessLostFromTransfer,
    onNavigateToEvent,
    onDeleteEvent,
    onDeleteEventRelationship,
    onUpdateOrAddEnrollmentEvents,
    onUpdateEnrollmentEventsSuccess,
    onUpdateEnrollmentEventsError,
    userInteractionInProgress,
}: PlainProps) => {
    const eventLabel = useTermLabel('event', { programId: program?.id });
    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <TopBar
                mode={mode}
                programStage={programStage}
                enrollmentId={enrollmentId}
                programId={program?.id}
                enrollmentsAsOptions={enrollmentsAsOptions}
                trackedEntityName={trackedEntityName}
                teiDisplayName={teiDisplayName}
                orgUnitId={orgUnitId}
                eventDate={eventDate}
                teiId={teiId}
                pageStatus={pageStatus}
                isUserInteractionInProgress={userInteractionInProgress}
            />
            <EnrollmentPageLayout
                pageLayout={pageLayout}
                currentPage={
                    mode === EnrollmentPageKeys.EDIT_EVENT
                        ? EnrollmentPageKeys.EDIT_EVENT
                        : EnrollmentPageKeys.VIEW_EVENT
                }
                availableWidgets={WidgetsForEnrollmentEventEdit}
                userInteractionInProgress={userInteractionInProgress}
                onBackToMainPage={onBackToMainPage}
                onBackToDashboard={onBackToDashboard}
                onBackToViewEvent={onBackToViewEvent}
                onSaveExternal={onSaveExternal}
                trackedEntityTypeId={trackedEntityTypeId}
                programStage={programStage}
                program={program}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                eventId={eventId}
                stageId={stageId}
                eventStatus={eventStatus}
                initialScheduleDate={scheduleDate}
                onCancelEditEvent={onCancelEditEvent}
                onHandleScheduleSave={onHandleScheduleSave}
                dataEntryKey={mode}
                dataEntryId={dataEntryIds.ENROLLMENT_EVENT}
                onLinkedRecordClick={onLinkedRecordClick}
                onEnrollmentError={onEnrollmentError}
                onEnrollmentSuccess={onEnrollmentSuccess}
                onUpdateEnrollmentStatus={onUpdateEnrollmentStatus}
                onUpdateEnrollmentStatusError={onUpdateEnrollmentStatusError}
                onUpdateEnrollmentStatusSuccess={onUpdateEnrollmentStatusSuccess}
                onSaveAndCompleteEnrollment={onSaveAndCompleteEnrollment}
                onSaveAndCompleteEnrollmentSuccessActionType={actionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS}
                onSaveAndCompleteEnrollmentErrorActionType={actionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_ERROR}
                events={events}
                pageStatus={pageStatus}
                widgetEffects={widgetEffects}
                hideWidgets={hideWidgets}
                onDelete={onDelete}
                onAddNew={onAddNew}
                eventAccess={eventAccess}
                assignee={assignee}
                getAssignedUserSaveContext={getAssignedUserSaveContext}
                onSaveAssignee={onSaveAssignee}
                onSaveAssigneeError={onSaveAssigneeError}
                onDeleteTrackedEntitySuccess={onDeleteTrackedEntitySuccess}
                onAccessLostFromTransfer={onAccessLostFromTransfer}
                feedbackEmptyText={customTerms.i18n.t('No feedback for this {{eventLabel}} yet', { eventLabel })}
                indicatorEmptyText={customTerms.i18n.t('No indicator output for this {{eventLabel}} yet', { eventLabel })}
                onNavigateToEvent={onNavigateToEvent}
                onDeleteEvent={onDeleteEvent}
                onDeleteEventRelationship={onDeleteEventRelationship}
                onUpdateOrAddEnrollmentEvents={onUpdateOrAddEnrollmentEvents}
                onUpdateEnrollmentEventsSuccess={onUpdateEnrollmentEventsSuccess}
                onUpdateEnrollmentEventsError={onUpdateEnrollmentEventsError}
            />
            <NoticeBox formId={`${dataEntryIds.ENROLLMENT_EVENT}-${mode}`} />
        </OrgUnitFetcher>
    );
};
