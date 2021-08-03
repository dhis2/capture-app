// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
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
    classes,
}: PlainProps) => (
    <div className={classes.page}>
        <div className={classes.title}>
            {mode === pageMode.VIEW
                ? i18n.t('Enrollment{{escape}} View Event', {
                    escape: ':',
                })
                : i18n.t('Enrollment{{escape}} Edit Event', {
                    escape: ':',
                })}
        </div>
        <div className={classes.columns}>
            <div className={classes.leftColumn}>
                {programStage ? (
                    <WidgetEventEdit programStage={programStage} mode={mode} />
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
                <WidgetProfile
                    teiId={teiId}
                    programId={programId}
                />
                <WidgetEnrollment
                    teiId={teiId}
                    enrollmentId={enrollmentId}
                    programId={programId}
                    onDelete={() => {}}
                />
            </div>
        </div>
    </div>
);

export const EnrollmentEditEventPageComponent: ComponentType<
    $Diff<PlainProps, CssClasses>,
> = withStyles(styles)(EnrollmentEditEventPagePain);
