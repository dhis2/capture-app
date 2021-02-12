// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useMissingCategoriesInProgramSelection } from '../../../hooks/useMissingCategoriesInProgramSelection';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { urlArguments } from '../../../utils/url';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import LinkButton from '../../Buttons/LinkButton.component';
import { useEnrollmentInfo } from './hooks';

export const missingStatuses = {
    TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED: 'TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED',
    EVENT_PROGRAM_SELECTED: 'EVENT_PROGRAM_SELECTED',
    MISSING_ENROLLMENT_SELECTION: 'MISSING_ENROLLMENT_SELECTION',
    MISSING_PROGRAM_CATEGORIES_SELECTION: 'MISSING_PROGRAM_CATEGORIES_SELECTION',
    MISSING_PROGRAM_SELECTION: 'MISSING_PROGRAM_SELECTION',
};

const useMissingStatus = () => {
    const { programId, enrollmentId } =
      useSelector(({ router: { location: { query } } }) =>
          ({
              teiId: query.teidId,
              programId: query.programId,
              enrollmentId: query.enrollmentId,
          }),
      );

    const { scopeType } = useScopeInfo(programId);
    const { programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();
    const { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId } = useEnrollmentInfo(enrollmentId, programId);
    const missingStatus = useMemo(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;
        const selectedProgramIsEvent = programId && scopeType === scopeTypes.EVENT_PROGRAM;
        if (selectedProgramIsTracker && programSelectionIsIncomplete) {
            return missingStatuses.MISSING_PROGRAM_CATEGORIES_SELECTION;
        } else if (selectedProgramIsTracker && programHasEnrollments && !enrollmentsOnProgramContainEnrollmentId) {
            return missingStatuses.MISSING_ENROLLMENT_SELECTION;
        } else if (selectedProgramIsTracker && !programHasEnrollments) {
            return missingStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED;
        } else if (selectedProgramIsEvent) {
            return missingStatuses.EVENT_PROGRAM_SELECTED;
        }
        return missingStatuses.MISSING_PROGRAM_SELECTION;
    }, [
        programId,
        programSelectionIsIncomplete,
        programHasEnrollments,
        enrollmentsOnProgramContainEnrollmentId,
        scopeType,
    ]);

    return { missingStatus };
};

const useNavigations = () => {
    const history = useHistory();
    const selectedProgramId: string =
      useSelector(({ router: { location: { query } } }) => query.programId);
    const selectedOrgUnitId: string =
      useSelector(({ router: { location: { query } } }) => query.orgUnitId);
    const navigateToEventRegistrationPage = () =>
        history.push(`/new?${urlArguments({ programId: selectedProgramId, orgUnitId: selectedOrgUnitId })}`);
    const navigateToEventWorkingList = () =>
        history.push(`/?${urlArguments({ programId: selectedProgramId, orgUnitId: selectedOrgUnitId })}`);

    return { navigateToEventRegistrationPage, navigateToEventWorkingList };
};

export const MissingMessage = () => {
    const { navigateToEventRegistrationPage, navigateToEventWorkingList } = useNavigations();
    const { missingStatus } = useMissingStatus();
    const { teiDisplayName } = useSelector(({ enrollmentPage }) => enrollmentPage);

    return (<>
        {
            missingStatus === missingStatuses.MISSING_PROGRAM_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('Choose program to view more information.')}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.MISSING_PROGRAM_CATEGORIES_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('MISSING CATEGORIES NEEDS BETTER TEXT')}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.MISSING_ENROLLMENT_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('Choose enrollment to view more information.')}
            </IncompleteSelectionsMessage>

        }

        {
            missingStatus === missingStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED &&
            <IncompleteSelectionsMessage>
                {i18n.t('There are no enrollments for {{teiDisplayName}} in the selected program', { teiDisplayName })}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.EVENT_PROGRAM_SELECTED &&
            <IncompleteSelectionsMessage>
                <div style={{ textAlign: 'center' }}>
                    {i18n.t('You selected an Event program. Event programs do not have tracked entities nor enrollments.')}
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

    </>);
};
