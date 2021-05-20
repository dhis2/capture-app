// @flow
import React, { type ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacersNum } from '@dhis2/ui';
import { WidgetStagesAndEvents } from '../../../WidgetStagesAndEvents';
import { WidgetEnrollment } from '../../../WidgetEnrollment';
import { WidgetProfile } from '../../../WidgetProfile';
import type { Props, PlainProps } from './EnrollmentPageDefault.types';

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
    enrollmentId,
    callbackDelete,
    classes,
}: PlainProps) => (
    <>
        <div className={classes.title}>Enrollment Dashboard</div>
        <div className={classes.columns}>
            <div className={classes.leftColumn}>
                <WidgetStagesAndEvents stages={program.stages} />
            </div>
            <div className={classes.rightColumn}>
                <WidgetProfile teiId={teiId} programId={program.id} />
                <WidgetEnrollment
                    teiId={teiId}
                    enrollmentId={enrollmentId}
                    programId={program.id}
                    callbackDelete={callbackDelete}
                />
            </div>
        </div>
    </>
);

export const EnrollmentPageDefaultComponent: ComponentType<Props> = withStyles(
    getStyles,
)(EnrollmentPageDefaultPlain);
