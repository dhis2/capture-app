// @flow
import React, { useCallback, useState } from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import { dataEntryIds, dataEntryKeys } from 'capture-core/constants';
import withStyles from '@material-ui/core/styles/withStyles';
import type { PlainProps } from './EnrollmentEditEventPage.types';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import { WidgetEventEdit } from '../../WidgetEventEdit/';
import { WidgetError } from '../../WidgetErrorAndWarning/WidgetError';
import { WidgetWarning } from '../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../WidgetFeedback';
import { WidgetIndicator } from '../../WidgetIndicator';
import { WidgetProfile } from '../../WidgetProfile';
import { WidgetEnrollment } from '../../WidgetEnrollment';
import { WidgetAssignee } from '../../WidgetAssignee';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { WidgetEventComment } from '../../WidgetEventComment';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';
import { TopBar } from './TopBar.container';
import {
    TrackedEntityRelationshipsWrapper,
} from '../common/TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper';
import { AddRelationshipRefWrapper } from './AddRelationshipRefWrapper';
import { NoticeBox } from '../../NoticeBox';

const styles = ({ typography }) => ({
    page: {
        margin: spacersNum.dp16,
    },
    addRelationshipContainer: {
        margin: spacersNum.dp16,
    },
    columns: {
        display: 'flex',
    },
    leftColumn: {
        flexGrow: 3,
        flexShrink: 1,
        width: 872,
    },
    rightColumn: {
        flexGrow: 1,
        flexShrink: 1,
        paddingLeft: spacersNum.dp16,
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentEditEventPageLeft = ({
    programStage,
    teiId,
    enrollmentId,
    programId,
    onGoBack,
    orgUnitId,
    scheduleDate,
    eventStatus,
    pageStatus,
    onCancelEditEvent,
    onHandleScheduleSave,
}) => (
    <>
        {pageStatus === pageStatuses.DEFAULT && programStage && (
            <WidgetEventEdit
                programStage={programStage}
                onGoBack={onGoBack}
                programId={programId}
                orgUnitId={orgUnitId}
                teiId={teiId}
                enrollmentId={enrollmentId}
                eventStatus={eventStatus}
                initialScheduleDate={scheduleDate}
                onCancelEditEvent={onCancelEditEvent}
                onHandleScheduleSave={onHandleScheduleSave}
            />
        )}
        {pageStatus === pageStatuses.MISSING_DATA && (
            <span>{i18n.t('The enrollment event data could not be found')}</span>
        )}
        {pageStatus === pageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
            <IncompleteSelectionsMessage>
                {i18n.t('Choose a registering unit to start reporting')}
            </IncompleteSelectionsMessage>
        )}
    </>
);

const EnrollmentEditEventPageRight = ({
    mode,
    programStage,
    teiId,
    enrollmentId,
    trackedEntityTypeId,
    programId,
    widgetEffects,
    hideWidgets,
    onDelete,
    onAddNew,
    onLinkedRecordClick,
    orgUnitId,
    eventAccess,
    assignee,
    onEnrollmentError,
    onEnrollmentSuccess,
    onGetAssignedUserSaveContext,
    onSaveAssignee,
    onSaveAssigneeError,
    addRelationShipContainerElement,
    toggleVisibility,
}) => (
    <>
        <WidgetAssignee
            programStage={programStage}
            assignee={assignee}
            onGetSaveContext={onGetAssignedUserSaveContext}
            eventAccess={eventAccess}
            onSave={onSaveAssignee}
            onSaveError={onSaveAssigneeError}
        />
        <WidgetEventComment dataEntryKey={mode} dataEntryId={dataEntryIds.ENROLLMENT_EVENT} />
        <WidgetError error={widgetEffects.errors} />
        <WidgetWarning warning={widgetEffects.warnings} />
        {!hideWidgets.feedback && (
            <WidgetFeedback
                emptyText={i18n.t('There are no feedback for this event')}
                feedback={widgetEffects.feedbacks}
            />
        )}
        {!hideWidgets.indicator && (
            <WidgetIndicator
                emptyText={i18n.t('There are no indicators for this event')}
                indicators={widgetEffects.indicators}
            />
        )}
        {addRelationShipContainerElement && (
            <TrackedEntityRelationshipsWrapper
                trackedEntityTypeId={trackedEntityTypeId}
                teiId={teiId}
                programId={programId}
                orgUnitId={orgUnitId}
                addRelationshipRenderElement={addRelationShipContainerElement}
                onOpenAddRelationship={toggleVisibility}
                onCloseAddRelationship={toggleVisibility}
                onAddRelationship={() => {}}
                onLinkedRecordClick={onLinkedRecordClick}
            />
        )}
        <WidgetProfile teiId={teiId} programId={programId} />
        <WidgetEnrollment
            teiId={teiId}
            enrollmentId={enrollmentId}
            programId={programId}
            readOnlyMode
            onDelete={onDelete}
            onAddNew={onAddNew}
            onError={onEnrollmentError}
            onSuccess={onEnrollmentSuccess}
        />
    </>
);

const EnrollmentEditEventPagePain = ({
    mode,
    programStage,
    teiId,
    enrollmentId,
    trackedEntityTypeId,
    programId,
    enrollmentsAsOptions,
    trackedEntityName,
    teiDisplayName,
    widgetEffects,
    hideWidgets,
    onDelete,
    onAddNew,
    classes,
    onGoBack,
    onLinkedRecordClick,
    orgUnitId,
    eventDate,
    scheduleDate,
    eventStatus,
    eventAccess,
    assignee,
    pageStatus,
    onEnrollmentError,
    onEnrollmentSuccess,
    onCancelEditEvent,
    onHandleScheduleSave,
    onGetAssignedUserSaveContext,
    onSaveAssignee,
    onSaveAssigneeError,
}: PlainProps) => {
    const [mainContentVisible, setMainContentVisible] = useState(true);
    const [addRelationShipContainerElement, setAddRelationShipContainerElement] = useState<?HTMLDivElement>(undefined);

    const toggleVisibility = useCallback(() => setMainContentVisible(current => !current), []);

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <TopBar
                mode={mode}
                programStage={programStage}
                enrollmentId={enrollmentId}
                programId={programId}
                enrollmentsAsOptions={enrollmentsAsOptions}
                trackedEntityName={trackedEntityName}
                teiDisplayName={teiDisplayName}
                orgUnitId={orgUnitId}
                eventDate={eventDate}
                teiId={teiId}
                pageStatus={pageStatus}
            />
            <div className={classes.addRelationshipContainer}>
                <AddRelationshipRefWrapper setRelationshipRef={setAddRelationShipContainerElement} />
            </div>
            <div className={classes.page} style={!mainContentVisible ? { display: 'none' } : undefined}>
                <div className={classes.title}>
                    {mode === dataEntryKeys.VIEW
                        ? i18n.t('Enrollment{{escape}} View Event', { escape: ':' })
                        : i18n.t('Enrollment{{escape}} Edit Event', { escape: ':' })}
                </div>
                <div className={classes.columns}>
                    <div className={classes.leftColumn}>
                        <EnrollmentEditEventPageLeft
                            programStage={programStage}
                            teiId={teiId}
                            enrollmentId={enrollmentId}
                            programId={programId}
                            classes={classes}
                            onGoBack={onGoBack}
                            orgUnitId={orgUnitId}
                            scheduleDate={scheduleDate}
                            eventStatus={eventStatus}
                            pageStatus={pageStatus}
                            onCancelEditEvent={onCancelEditEvent}
                            onHandleScheduleSave={onHandleScheduleSave}
                        />
                    </div>
                    <div className={classes.rightColumn}>
                        <EnrollmentEditEventPageRight
                            mode={mode}
                            programStage={programStage}
                            teiId={teiId}
                            enrollmentId={enrollmentId}
                            trackedEntityTypeId={trackedEntityTypeId}
                            programId={programId}
                            widgetEffects={widgetEffects}
                            hideWidgets={hideWidgets}
                            onDelete={onDelete}
                            onAddNew={onAddNew}
                            onLinkedRecordClick={onLinkedRecordClick}
                            orgUnitId={orgUnitId}
                            eventAccess={eventAccess}
                            assignee={assignee}
                            onEnrollmentError={onEnrollmentError}
                            onEnrollmentSuccess={onEnrollmentSuccess}
                            onGetAssignedUserSaveContext={onGetAssignedUserSaveContext}
                            onSaveAssignee={onSaveAssignee}
                            onSaveAssigneeError={onSaveAssigneeError}
                            addRelationShipContainerElement={addRelationShipContainerElement}
                            toggleVisibility={toggleVisibility}
                        />
                    </div>
                </div>
                <NoticeBox formId={`${dataEntryIds.ENROLLMENT_EVENT}-${mode}`} />
            </div>
        </OrgUnitFetcher>
    );
};

export const EnrollmentEditEventPageComponent: ComponentType<$Diff<PlainProps, CssClasses>> =
    withStyles(styles)(EnrollmentEditEventPagePain);
