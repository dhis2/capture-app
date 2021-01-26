// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import LoadingMaskForPage from '../../LoadingMasks/LoadingMaskForPage.component';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
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
            enrollmentPageStatus === enrollmentPageStatuses.MISSING_PROGRAM_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('Choose program to view more information')}
            </IncompleteSelectionsMessage>
        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.MISSING_PROGRAM_CATEGORIES_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('MISSING CATEGORIES NEEDS BETTER TEXT')}
            </IncompleteSelectionsMessage>
        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.MISSING_ENROLLMENT_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('Choose enrollment to view more information')}
            </IncompleteSelectionsMessage>

        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED &&
            <IncompleteSelectionsMessage>
                {i18n.t('There are no enrollments for this program.')}
            </IncompleteSelectionsMessage>
        }

        {
            // todo need to make "here" a link
            enrollmentPageStatus === enrollmentPageStatuses.EVENT_PROGRAM_SELECTED &&
            <IncompleteSelectionsMessage>
                <div style={{ textAlign: 'center' }}>
                    {i18n.t('You selected an event program. Event do not have enrollments.')}
                    <div>{i18n.t('To create a new event click **here**.')}</div>
                    <div>{i18n.t('To view the working lists click **here**.')}</div>
                </div>
            </IncompleteSelectionsMessage>
        }

        {
            enrollmentPageStatus === enrollmentPageStatuses.LOADING &&
                <div className={classes.loadingMask}>
                    <LoadingMaskForPage />
                </div>
        }
    </div>
</>);

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(EnrollmentPagePlain);
