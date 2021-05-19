// @flow
import React, { useEffect, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useMissingCategoriesInProgramSelection } from '../../../hooks/useMissingCategoriesInProgramSelection';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { urlArguments } from '../../../utils/url';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { LinkButton } from '../../Buttons/LinkButton.component';
import { useEnrollmentInfo } from './hooks';

export const missingStatuses = {
    TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED: 'TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED',
    TRACKER_PROGRAM_OF_DIFFERENT_TYPE_SELECTED: 'TRACKER_PROGRAM_OF_DIFFERENT_TYPE_SELECTED',
    EVENT_PROGRAM_SELECTED: 'EVENT_PROGRAM_SELECTED',
    MISSING_ENROLLMENT_SELECTION: 'MISSING_ENROLLMENT_SELECTION',
    MISSING_PROGRAM_CATEGORIES_SELECTION: 'MISSING_PROGRAM_CATEGORIES_SELECTION',
    MISSING_PROGRAM_SELECTION: 'MISSING_PROGRAM_SELECTION',
};

const useMissingStatus = () => {
    const dispatch = useDispatch();
    const [missingStatus, setStatus] = useState(null);

    const { programId, enrollmentId } =
      useSelector(({ router: { location: { query } } }) =>
          ({
              teiId: query.teidId,
              programId: query.programId,
              enrollmentId: query.enrollmentId,
          }),
      );

    const { scopeType, tetId: scopeTetId } = useScopeInfo(programId);
    const { programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();
    const { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, tetId } = useEnrollmentInfo(enrollmentId, programId);
    const selectedProgramIsOfDifferentTypTetype = scopeTetId !== tetId;
    useEffect(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;
        const selectedProgramIsEvent = programId && scopeType === scopeTypes.EVENT_PROGRAM;

        if (selectedProgramIsTracker && programSelectionIsIncomplete) {
            setStatus(missingStatuses.MISSING_PROGRAM_CATEGORIES_SELECTION);
        } else if (selectedProgramIsTracker && selectedProgramIsOfDifferentTypTetype) {
            setStatus(missingStatuses.TRACKER_PROGRAM_OF_DIFFERENT_TYPE_SELECTED);
        } else if (selectedProgramIsTracker && programHasEnrollments && !enrollmentsOnProgramContainEnrollmentId) {
            setStatus(missingStatuses.MISSING_ENROLLMENT_SELECTION);
        } else if (selectedProgramIsTracker && !programHasEnrollments) {
            setStatus(missingStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED);
        } else if (selectedProgramIsEvent) {
            setStatus(missingStatuses.EVENT_PROGRAM_SELECTED);
        } else {
            setStatus(missingStatuses.MISSING_PROGRAM_SELECTION);
        }
    }, [
        dispatch,
        programId,
        programSelectionIsIncomplete,
        programHasEnrollments,
        enrollmentsOnProgramContainEnrollmentId,
        selectedProgramIsOfDifferentTypTetype,
        scopeType,
    ]);

    return { missingStatus };
};

const useNavigations = () => {
    const history = useHistory();
    const { tetId } = useSelector(({ enrollmentPage }) => enrollmentPage);

    const selectedProgramId: string =
      useSelector(({ router: { location: { query } } }) => query.programId);
    const selectedOrgUnitId: string =
      useSelector(({ router: { location: { query } } }) => query.orgUnitId);
    const navigateToProgramRegistrationPage = () =>
        history.push(`/new?${urlArguments({ programId: selectedProgramId, orgUnitId: selectedOrgUnitId })}`);
    const navigateToEventWorkingList = () =>
        history.push(`/?${urlArguments({ programId: selectedProgramId, orgUnitId: selectedOrgUnitId })}`);
    const navigateToTetRegistrationPage = () =>
        history.push(`/new?${urlArguments({ programId: selectedProgramId, orgUnitId: selectedOrgUnitId, trackedEntityTypeId: tetId })}`);

    return { navigateToProgramRegistrationPage, navigateToEventWorkingList, navigateToTetRegistrationPage };
};

const getStyles = () => ({
    lineHeight: { lineHeight: 1.8 },
    link: {
        background: 'transparent',
        padding: 0,
    },
});

export const MissingMessage = withStyles(getStyles)(({ classes }) => {
    const { navigateToProgramRegistrationPage, navigateToEventWorkingList } = useNavigations();
    const { missingStatus } = useMissingStatus();
    const { teiDisplayName, tetId } = useSelector(({ enrollmentPage }) => enrollmentPage);
    const selectedProgramId: string =
      useSelector(({ router: { location: { query } } }) => query.programId);

    const { trackedEntityName: tetName } = useScopeInfo(tetId);
    const { programName, trackedEntityName: selectedTetName } = useScopeInfo(selectedProgramId);
    return (<>
        {
            missingStatus === missingStatuses.MISSING_PROGRAM_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('{{teiDisplayName}} is enrolled in multiple programs. Choose a program.', { teiDisplayName })}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.MISSING_PROGRAM_CATEGORIES_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('{{programName}} has categories. Choose all categories to view dashboard.', { programName })}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.MISSING_ENROLLMENT_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('There are multiple enrollments for this program. Choose an enrollment to view the dashboard.')}
            </IncompleteSelectionsMessage>

        }

        {
            missingStatus === missingStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED &&
            <IncompleteSelectionsMessage>
                <div className={classes.lineHeight}>
                    {i18n.t('{{teiDisplayName}} is not enrolled in this program.', { teiDisplayName })}
                    <div>

                        <LinkButton
                            className={classes.link}
                            onClick={navigateToProgramRegistrationPage}
                        >
                            {i18n.t('Enroll {{teiDisplayName}} in this program.', { teiDisplayName })}
                        </LinkButton>
                    </div>
                </div>
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.TRACKER_PROGRAM_OF_DIFFERENT_TYPE_SELECTED &&
            <IncompleteSelectionsMessage>
                <div className={classes.lineHeight}>
                    {i18n.t('{{teiDisplayName}} is a {{tetName}} and cannot be enrolled in the {{programName}}. Choose another program that allows {{tetName}} enrollment. ', { teiDisplayName, programName, tetName })}
                    <div>
                        <LinkButton
                            className={classes.link}
                            onClick={navigateToProgramRegistrationPage}
                        >
                            {i18n.t('Enroll a new {{selectedTetName}} in this program.', { selectedTetName })}
                        </LinkButton>
                    </div>
                </div>
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.EVENT_PROGRAM_SELECTED &&
            <IncompleteSelectionsMessage>
                <div className={classes.lineHeight}>
                    {i18n.t('{{programName}} is an event program and does not have enrollments.', { programName })}
                    <div>
                        <LinkButton
                            className={classes.link}
                            onClick={navigateToProgramRegistrationPage}
                        >
                            {i18n.t('Create a new event in this program.')}
                        </LinkButton>
                    </div>
                    <div>
                        <LinkButton
                            className={classes.link}
                            onClick={navigateToEventWorkingList}
                        >
                            {i18n.t('View working list in this program.')}
                        </LinkButton>
                    </div>
                </div>
            </IncompleteSelectionsMessage>
        }

    </>);
});
