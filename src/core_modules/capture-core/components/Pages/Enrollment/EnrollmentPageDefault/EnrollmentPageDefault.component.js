// @flow
import React, { type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacersNum } from '@dhis2/ui';
import { WidgetEnrollmentContainer as WidgetEnrollment } from '../../../WidgetEnrollment';
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

export const EnrollmentPageDefaultPlain = ({ classes }: PlainProps) => {
    const { enrollmentId, teiId, programId } = useSelector(({ router: { location: { query } } }) => ({
        enrollmentId: query.enrollmentId,
        teiId: query.teiId,
        programId: query.programId,
    }));
    return (
        <>
            <div className={classes.title}>Enrollment Dashboard</div>
            <div className={classes.rightColumn}>
                <WidgetProfile />
                <WidgetEnrollment teiId={teiId} enrollmentId={enrollmentId} programId={programId} />
            </div>
        </>
    );
};

export const EnrollmentPageDefaultComponent: ComponentType<Props> = withStyles(getStyles)(EnrollmentPageDefaultPlain);
