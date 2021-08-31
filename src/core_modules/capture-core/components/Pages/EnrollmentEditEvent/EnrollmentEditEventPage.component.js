// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import type { PlainProps } from './EnrollmentEditEventPage.types';
import { pageMode, pageStatuses } from './EnrollmentEditEventPage.constants';
import { WidgetEventEdit } from '../../WidgetEventEdit/';
import { WidgetError } from '../../WidgetErrorAndWarning/WidgetError';
import { WidgetWarning } from '../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../WidgetFeedback';
import { WidgetIndicator } from '../../WidgetIndicator';
import { WidgetProfile } from '../../WidgetProfile';
import { WidgetEnrollment } from '../../WidgetEnrollment';
import {
    ScopeSelector,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    useResetTeiId,
    useResetEnrollmentId,
    useResetStageId,
    useResetEventId,
} from '../../ScopeSelector';
import { SingleLockedSelect } from '../../ScopeSelector/QuickSelector/SingleLockedSelect.component';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';

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
    classes,
    onGoBack,
    orgUnitId,
    eventDate,
    pageStatus,
}: PlainProps) => {
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetEnrollmentId } = useResetEnrollmentId();
    const { resetTeiId } = useResetTeiId();
    const { resetStageId } = useResetStageId();
    const { resetEventId } = useResetEventId();
    const isUserInteractionInProgress = mode === pageMode.EDIT;

    return (
        <>
            <ScopeSelector
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                onSetOrgUnit={id => setOrgUnitId(id)}
                onResetProgramId={() => resetProgramIdAndEnrollmentContext('enrollment')}
                onResetOrgUnitId={() => resetOrgUnitId()}
                isUserInteractionInProgress={isUserInteractionInProgress}
            >
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetTeiId('/')}
                        options={[
                            {
                                label: teiDisplayName,
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={trackedEntityName}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetEnrollmentId('enrollment')}
                        options={enrollmentsAsOptions}
                        selectedValue={enrollmentId}
                        title={i18n.t('Enrollment')}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={pageStatus !== pageStatuses.MISSING_DATA}
                        onClear={() => resetStageId('enrollment')}
                        options={[
                            {
                                label: programStage?.name || '',
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={i18n.t('stage')}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
                {programStage && (
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <SingleLockedSelect
                            ready={pageStatus !== pageStatuses.MISSING_DATA}
                            onClear={() => resetEventId('enrollment')}
                            options={[
                                {
                                    label: eventDate || '',
                                    value: 'alwaysPreselected',
                                },
                            ]}
                            selectedValue="alwaysPreselected"
                            title={programStage.stageForm.getLabel('eventDate')}
                            isUserInteractionInProgress={isUserInteractionInProgress}
                        />
                    </Grid>
                )}
            </ScopeSelector>
            <div className={classes.page}>
                <div className={classes.title}>
                    {mode === pageMode.VIEW
                        ? i18n.t('Enrollment{{escape}} View Event', { escape: ':' })
                        : i18n.t('Enrollment{{escape}} Edit Event', { escape: ':' })}
                </div>
                <div className={classes.columns}>
                    <div className={classes.leftColumn}>
                        {pageStatus === pageStatuses.DEFAULT && programStage && (
                            <WidgetEventEdit programStage={programStage} onGoBack={onGoBack} />
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
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export const EnrollmentEditEventPageComponent: ComponentType<$Diff<PlainProps, CssClasses>> =
    withStyles(styles)(EnrollmentEditEventPagePain);
