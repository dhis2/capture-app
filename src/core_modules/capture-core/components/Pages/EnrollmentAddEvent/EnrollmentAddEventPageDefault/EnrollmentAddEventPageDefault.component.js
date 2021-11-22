// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPageDefault.types';
import { WidgetError } from '../../../WidgetErrorAndWarning/WidgetError';
import { WidgetWarning } from '../../../WidgetErrorAndWarning/WidgetWarning';
import { WidgetFeedback } from '../../../WidgetFeedback';
import { WidgetIndicator } from '../../../WidgetIndicator';
import { WidgetProfile } from '../../../WidgetProfile';
import { WidgetEnrollment } from '../../../WidgetEnrollment';
import { IncompleteSelectionsMessage } from '../../../IncompleteSelectionsMessage';
import { ProgramStageSelector } from '../ProgramStageSelector';
import { NewEventWorkspace } from '../NewEventWorkspace';

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
    stageId,
    orgUnitId,
    teiId,
    enrollmentId,
    widgetEffects,
    hideWidgets,
    onDelete,
    pageFailure,
    ready,
    classes,
    ...passOnProps
}: Props) => (<div className={classes.container} data-test="add-event-enrollment-page-content">
    <div className={classes.title}>{i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}</div>
    {(() => {
        if (pageFailure) {
            return (
                <div>
                    {i18n.t('There was an error loading the page')}
                </div>
            );
        } else if (!orgUnitId) {
            return (
                <IncompleteSelectionsMessage>
                    {i18n.t('Choose a registering unit to start reporting')}
                </IncompleteSelectionsMessage>
            );
        } else if (!ready) {
            return null;
        }

        return (
            <div>
                <div className={classes.columns}>
                    <div className={classes.leftColumn}>
                        <div
                            className={classes.addEventContainer}
                            data-test="add-event-enrollment-page-content"
                        >
                            {!stageId ?
                                <ProgramStageSelector
                                    programId={programId}
                                    orgUnitId={orgUnitId}
                                    teiId={teiId}
                                    enrollmentId={enrollmentId}
                                />
                                :
                                <NewEventWorkspace
                                    {...passOnProps}
                                    programId={programId}
                                    stageId={stageId}
                                    orgUnitId={orgUnitId}
                                    teiId={teiId}
                                    enrollmentId={enrollmentId}
                                />
                            }
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
    })()}
</div>);

export const EnrollmentAddEventPageDefaultComponent: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(styles)(EnrollmentAddEventPagePain);
