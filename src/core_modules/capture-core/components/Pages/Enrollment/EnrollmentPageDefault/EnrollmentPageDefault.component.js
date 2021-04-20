// @flow
import React, { type ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { StagesAndEventsWidget } from '../../../Widgets';
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
        paddingLeft: 16,
        width: 360,
    },
    title: {
        ...typography.title,
        paddingTop: 16,
        paddingBottom: 16,
    },
});

export const EnrollmentPageDefaultPlain = ({ program, classes }: PlainProps) => (
    <>
        <div className={classes.title}>
            Enrollment Dashboard
        </div>
        <div className={classes.columns}>
            <div className={classes.leftColumn}>
                <StagesAndEventsWidget
                    stages={program.stages}
                />
            </div>
            <div className={classes.rightColumn}>
                [placeholder]
            </div>
        </div>
    </>
);

export const EnrollmentPageDefaultComponent: ComponentType<Props> = withStyles(getStyles)(EnrollmentPageDefaultPlain);
