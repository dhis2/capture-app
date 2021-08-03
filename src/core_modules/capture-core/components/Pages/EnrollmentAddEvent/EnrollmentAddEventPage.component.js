// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPage.types';
import { WidgetAddEvent } from '../../WidgetAddEvent';
import { WidgetError } from '../../WidgetErrorAndWarning/WidgetError';
import { WidgetWarning } from '../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../WidgetFeedback';
import { WidgetIndicator } from '../../WidgetIndicator';
import { WidgetProfile } from '../../WidgetProfile';
import { WidgetEnrollment } from '../../WidgetEnrollment';

const styles = ({ typography }) => ({
    container: {
        padding: '16px 24px 16px 24px',
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

const EnrollmentAddEventPagePain = ({
    programId,
    programStage,
    classes,
    enrollmentId,
    onDelete,
    teiId,
    widgetEffects,
    hideWidgets,
}) => (
    <div
        className={classes.container}
        data-test="add-event-enrollment-page-content"
    >
        <div className={classes.title}>
            {i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}
        </div>
        <div className={classes.columns}>
            <div className={classes.leftColumn}>
                <div
                    className={classes.addEventContainer}
                    data-test="add-event-enrollment-page-content"
                >
                    <div>
                        <WidgetAddEvent
                            programStage={programStage}
                        />
                    </div>
                </div>
            </div>
            <div className={classes.rightColumn}>
                <WidgetError error={widgetEffects?.errors} />
                <WidgetWarning warning={widgetEffects?.warnings} />
                {!hideWidgets.feedback && (
                    <WidgetFeedback
                        emptyText={i18n.t('There are no feedbacks for this event')}
                        feedback={widgetEffects?.feedbacks}
                    />
                )}
                {!hideWidgets.indicator && (
                    <WidgetIndicator
                        emptyText={i18n.t('There are no indicators for this event')}
                        indicators={widgetEffects?.indicators}
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
                    onDelete={onDelete}
                />
            </div>
        </div>
    </div>
);

export const EnrollmentAddEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentAddEventPagePain);
