// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import LoadingMaskForPage from '../../LoadingMasks/LoadingMaskForPage.component';
import { resetProgramOnEnrollmentPage } from './EnrollmentPage.actions';
import { withErrorMessageHandler } from '../../../HOC';

const getStyles = () => ({
    container: {
        padding: '24px 24px 16px 24px',
    },
    loadingMask: {
        height: '100vh',
    },
});

const EnrollmentPagePlain = ({ classes, enrollmentPageStatus }) => (<>
    <LockedSelector pageToPush="enrollment" customActionsOnProgramIdReset={[resetProgramOnEnrollmentPage()]} />

    <div data-test="dhis2-capture-enrollment-page-content" className={classes.container} >

        {
            enrollmentPageStatus === enrollmentPageStatuses.DEFAULT &&
                <div>default</div>
        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.LOADING &&
                <div className={classes.loadingMask}>
                    <LoadingMaskForPage />
                </div>
        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.ERROR &&
                <div>
                    error
                </div>
        }
    </div>
</>);

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(EnrollmentPagePlain);
