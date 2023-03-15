// @flow
import React from 'react';
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
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { WidgetEventComment } from '../../WidgetEventComment';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';
import { TopBar } from './TopBar.container';

const styles = ({ typography }) => ({
    page: {
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

const EnrollmentEditEventPagePain = ({
    mode,
    programStage,
    teiId,
    enrollmentId,
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
    orgUnitId,
    eventDate,
    scheduleDate,
    eventStatus,
    pageStatus,
    onEnrollmentError,
    onCancelEditEvent,
    onHandleScheduleSave,
    categoryCombination,
}: PlainProps) => (
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
        <div className={classes.page}>
            <div className={classes.title}>
                {mode === dataEntryKeys.VIEW
                    ? i18n.t('Enrollment{{escape}} View Event', { escape: ':' })
                    : i18n.t('Enrollment{{escape}} Edit Event', { escape: ':' })}
            </div>
            <div className={classes.columns}>
                <div className={classes.leftColumn}>
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
                            categoryCombination={categoryCombination}
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
                </div>
                <div className={classes.rightColumn}>
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
                    <WidgetProfile teiId={teiId} programId={programId} />
                    <WidgetEnrollment
                        teiId={teiId}
                        enrollmentId={enrollmentId}
                        programId={programId}
                        onDelete={onDelete}
                        onAddNew={onAddNew}
                        onError={onEnrollmentError}
                    />
                </div>
            </div>
        </div>
    </OrgUnitFetcher>
);

export const EnrollmentEditEventPageComponent: ComponentType<$Diff<PlainProps, CssClasses>> =
    withStyles(styles)(EnrollmentEditEventPagePain);
