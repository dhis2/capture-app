// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props } from './EnrollmentEditEventPage.types';

const styles = ({ typography }) => ({
    title: {
        ...typography.title,
    },
});

const EnrollmentEditEventPagePain = ({ classes }) => (
    <>
        <div className={classes.title}>Enrollment: Edit Event</div>
    </>
);

export const EnrollmentEditEventPageComponent: ComponentType<
    $Diff<Props, CssClasses>,
> = withStyles(styles)(EnrollmentEditEventPagePain);
