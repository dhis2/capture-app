// @flow
import React from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import LoadingMaskForPage from '../../LoadingMasks/LoadingMaskForPage.component';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { resetProgramOnEnrollmentPage } from './EnrollmentPage.actions';
import { withErrorMessageHandler } from '../../../HOC';
import LinkButton from '../../Buttons/LinkButton.component';
import { urlArguments } from '../../../utils/url';

const getStyles = () => ({
    container: {
        padding: '24px 24px 16px 24px',
    },
    loadingMask: {
        height: '100vh',
    },
});

const EnrollmentPagePlain = ({ classes, enrollmentPageStatus, selectedProgramId, selectedOrgUnitId }) => {
    const history = useHistory();
    const navigateToEventRegistrationPage = () =>
        history.push(`/new?${urlArguments({ programId: selectedProgramId, orgUnitId: selectedOrgUnitId })}`);
    const navigateToEventWorkingList = () =>
        history.push(`/?${urlArguments({ programId: selectedProgramId, orgUnitId: selectedOrgUnitId })}`);

    return (<>
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
                enrollmentPageStatus === enrollmentPageStatuses.EVENT_PROGRAM_SELECTED &&
                <IncompleteSelectionsMessage>
                    <div style={{ textAlign: 'center' }}>
                        {i18n.t('You selected an event program. Event do not have enrollments.')}
                        <div>
                            {i18n.t('To create a new event')}
                            {' '}
                            <LinkButton
                                style={{
                                    background: 'transparent',
                                    padding: 0,
                                    color: '#0000EE',
                                }}
                                onClick={navigateToEventRegistrationPage}
                            >
                                here
                            </LinkButton>
                            .
                        </div>
                        <div>
                            {i18n.t('To view the working lists click')}
                            {' '}
                            <LinkButton
                                style={{
                                    background: 'transparent',
                                    padding: 0,
                                    color: '#0000EE',
                                }}
                                onClick={navigateToEventWorkingList}
                            >
                                here
                            </LinkButton>
                            .
                        </div>
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
};

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(EnrollmentPagePlain);
