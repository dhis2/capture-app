// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { LockedSelector } from '../../LockedSelector';

const getStyles = () => ({
    container: {
        padding: '8px 24px 16px 24px',
    },
});


const EnrollmentPagePlain = ({ classes }) => (<>
    <LockedSelector />

    <div data-test="dhis2-capture-enrollment-page-content" className={classes.container} >
        hello from enrollment
    </div>
</>);

export const EnrollmentPage: ComponentType<{||}> =
  withStyles(getStyles)(EnrollmentPagePlain);
