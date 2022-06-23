// @flow
import React, { type ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { WidgetStagesAndEvents } from '../../../WidgetStagesAndEvents';
import { WidgetEnrollment } from '../../../WidgetEnrollment';
import { WidgetProfile } from '../../../WidgetProfile';
import type { Props, PlainProps } from './EnrollmentPageDefault.types';
import { WidgetWarning } from '../../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../../WidgetFeedback';
import { WidgetError } from '../../../WidgetErrorAndWarning/WidgetError';
import { WidgetIndicator } from '../../../WidgetIndicator';
import { WidgetEnrollmentComment } from '../../../WidgetEnrollmentComment';

const getStyles = ({ typography }) => ({
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
        paddingTop: spacersNum.dp16,
        paddingBottom: spacersNum.dp16,
    },
});

export const EnrollmentPageDefaultPlain = ({
    program,
    teiId,
    events,
    enrollmentId,
    stages,
    onDelete,
    onEnrollmentError,
    onViewAll,
    onCreateNew,
    widgetEffects,
    hideWidgets,
    classes,
    onEventClick,
}: PlainProps) => (
    <>
        <div className={classes.title}>{i18n.t('Enrollment Dashboard')}</div>
        <div className={classes.columns}>
            <div className={classes.leftColumn}>
                <WidgetStagesAndEvents
                    stages={stages}
                    events={events}
                    onViewAll={onViewAll}
                    onCreateNew={onCreateNew}
                    onEventClick={onEventClick}
                />
            </div>
            <div className={classes.rightColumn}>
                <WidgetEnrollmentComment />
                <WidgetError error={widgetEffects?.errors} />
                <WidgetWarning warning={widgetEffects?.warnings} />
                {!hideWidgets.indicator && (
                    <WidgetIndicator
                        indicators={widgetEffects?.indicators}
                        emptyText={i18n.t('No indicator output for this enrollment yet')}
                    />
                )}
                {!hideWidgets.feedback && (
                    <WidgetFeedback
                        feedback={widgetEffects?.feedbacks}
                        emptyText={i18n.t('No feedback for this enrollment yet')}
                    />
                )}
                <WidgetProfile teiId={teiId} programId={program.id} />
                {enrollmentId !== 'AUTO' && <WidgetEnrollment
                    teiId={teiId}
                    enrollmentId={enrollmentId}
                    programId={program.id}
                    onDelete={onDelete}
                    onError={onEnrollmentError}
                />}
            </div>
        </div>
    </>
);


export const EnrollmentPageDefaultComponent: ComponentType<Props> = withStyles(
    getStyles,
)(EnrollmentPageDefaultPlain);
