// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import type { PlainProps } from './EnrollmentEditEventPage.types';
import { pageMode } from './EnrollmentEditEventPage.const';
import { WidgetEventEdit } from '../../WidgetEventEdit/';
import { WidgetError } from '../../WidgetErrorAndWarning/WidgetError';
import { WidgetWarning } from '../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../WidgetFeedback';
import { WidgetIndicator } from '../../WidgetIndicator';
import { WidgetProfile } from '../../WidgetProfile';
import { WidgetEnrollment } from '../../WidgetEnrollment';
import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';

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
    widgetEffects,
    hideWidgets,
    onDelete,
    classes,
    onGoBack,
    orgUnitId,
}: PlainProps) => {
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();

    return (
        <>
            <ScopeSelector
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                onSetProgramId={id => setProgramId(id)}
                onSetOrgUnit={id => setOrgUnitId(id)}
                onResetProgramId={() => resetProgramId()}
                onResetOrgUnitId={() => resetOrgUnitId()}
            >
                <Grid item xs={12} sm={6} md={6} lg={2}>
                    <TopBarActions
                        selectedProgramId={programId}
                        selectedOrgUnitId={orgUnitId}
                        isUserInteractionInProgress={mode === pageMode.EDIT}
                    />
                </Grid>
            </ScopeSelector>
            <div className={classes.page}>
                <div className={classes.title}>
                    {mode === pageMode.VIEW
                        ? i18n.t('Enrollment{{escape}} View Event', { escape: ':' })
                        : i18n.t('Enrollment{{escape}} Edit Event', { escape: ':' })}
                </div>
                <div className={classes.columns}>
                    <div className={classes.leftColumn}>
                        {programStage ? (
                            <WidgetEventEdit programStage={programStage} onGoBack={onGoBack} />
                        ) : (
                            <span>{i18n.t('We could not find the stage in the program')}</span>
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
