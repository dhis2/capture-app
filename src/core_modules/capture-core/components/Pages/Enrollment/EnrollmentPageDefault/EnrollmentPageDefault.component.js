// @flow
import React, { type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacersNum } from '@dhis2/ui';
import { WidgetStagesAndEvents } from '../../../WidgetStagesAndEvents';
import { WidgetEnrollmentContainer as WidgetEnrollment } from '../../../WidgetEnrollment';
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

export const EnrollmentPageDefaultPlain = ({ program, classes }: PlainProps) => {
    const { enrollmentId, teiId, programId } =
      useSelector(({ router: { location: { query } } }) =>
          ({
              enrollmentId: query.enrollmentId,
              teiId: query.teiId,
              programId: query.programId,
          }),
      );
    return (
        <>
            <div className={classes.title}>
                Enrollment Dashboard
            </div>
            <div className={classes.columns}>
                <div className={classes.leftColumn}>
                    <WidgetStagesAndEvents
                        stages={program.stages}
                    />
                </div>
                <div className={classes.rightColumn}>
                    [placeholder profile widget]
                    <WidgetEnrollment teiId={teiId} enrollmentId={enrollmentId} programId={programId} />
                </div>
            </div>
        </>
    );
};

export const EnrollmentPageDefaultComponent: ComponentType<Props> = withStyles(getStyles)(EnrollmentPageDefaultPlain);
