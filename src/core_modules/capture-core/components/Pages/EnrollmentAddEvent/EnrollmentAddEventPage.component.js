// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentAddEventPage.types';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { Widget } from '../../Widget';
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
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp8,
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    title: {
        ...typography.title,
        margin: `${spacersNum.dp16}px 0`,
    },
});

const EnrollmentAddEventPagePain = ({
    program,
    programStage,
    classes,
    enrollmentId,
    onDelete,
    teiId,
    widgetEffects,
}) => {
    const { icon, stageForm } = programStage;

    return (
        <div
            className={classes.container}
            data-test="add-event-enrollment-page-content"
        >
            <div className={classes.title}>
                {i18n.t('Enrollment{{escape}} New Event', { escape: ':' })}
            </div>
            <div className={classes.columns}>
                <div className={classes.leftColumn}>
                    <Widget
                        header={
                            <div className={classes.header}>
                                {icon && (
                                    <div className={classes.icon}>
                                        <NonBundledDhis2Icon
                                            name={icon?.name}
                                            color={icon?.color}
                                            width={30}
                                            height={30}
                                            cornerRadius={2}
                                        />
                                    </div>
                                )}
                                <span> {stageForm.name} </span>
                            </div>
                        }
                        noncollapsible
                    >
                        [event details]
                    </Widget>
                </div>
                <div className={classes.rightColumn}>
                    <WidgetError error={widgetEffects?.errors} />
                    <WidgetWarning warning={widgetEffects?.warnings} />
                    <WidgetFeedback
                        emptyText={'There are no feedbacks'}
                        feedback={widgetEffects?.feedbacks}
                    />
                    <WidgetIndicator
                        emptyText={'There are no indicators for this program stage'}
                        indicators={widgetEffects?.indicators}
                    />
                    <WidgetProfile
                        teiId={teiId}
                        programId={program.id}
                    />
                    <WidgetEnrollment
                        teiId={teiId}
                        enrollmentId={enrollmentId}
                        programId={program.id}
                        onDelete={onDelete}
                    />
                </div>
            </div>

        </div>
    );
};

export const EnrollmentAddEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentAddEventPagePain);
