// @flow
import React, { useEffect, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useMissingCategoriesInProgramSelection } from '../../../hooks/useMissingCategoriesInProgramSelection';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { enrollmentAccessLevels } from './EnrollmentPage.constants';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { WidgetBreakingTheGlass } from '../../WidgetBreakingTheGlass';
import { LinkButton } from '../../Buttons/LinkButton.component';
import { useEnrollmentInfo } from './useEnrollmentInfo';
import { fetchEnrollments } from './EnrollmentPage.actions';
import { useResetProgramId } from '../../ScopeSelector';

export const missingStatuses = {
    TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED: 'TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED',
    TRACKER_PROGRAM_OF_DIFFERENT_TYPE_SELECTED: 'TRACKER_PROGRAM_OF_DIFFERENT_TYPE_SELECTED',
    PROTECTED_PROGRAM_WITH_BREAKING_THE_GLASS: 'PROTECTED_PROGRAM_WITH_BREAKING_THE_GLASS',
    RESTRICTED_PROGRAM_NO_ACCESS: 'RESTRICTED_PROGRAM_NO_ACCESS',
    EVENT_PROGRAM_SELECTED: 'EVENT_PROGRAM_SELECTED',
    MISSING_ENROLLMENT_SELECTION: 'MISSING_ENROLLMENT_SELECTION',
    MISSING_ENROLLMENT_SELECTION_ADD_NEW: 'MISSING_ENROLLMENT_SELECTION_ADD_NEW',
    MISSING_PROGRAM_CATEGORIES_SELECTION: 'MISSING_PROGRAM_CATEGORIES_SELECTION',
    MISSING_PROGRAM_SELECTION: 'MISSING_PROGRAM_SELECTION',
};

const useMissingStatus = () => {
    const [missingStatus, setStatus] = useState(null);

    const { programId, enrollmentId, teiId } = useLocationQuery();

    const { scopeType, tetId: scopeTetId } = useScopeInfo(programId);
    const { programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();
    const {
        programHasEnrollments,
        programHasActiveEnrollments,
        enrollmentsOnProgramContainEnrollmentId,
        onlyEnrollOnce,
        tetId,
    } = useEnrollmentInfo(enrollmentId, programId, teiId);
    const { enrollmentAccessLevel } = useSelector(({ enrollmentPage }) => enrollmentPage);
    const selectedProgramIsOfDifferentTypTetype = scopeTetId !== tetId;
    useEffect(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;
        const selectedProgramIsEvent = programId && scopeType === scopeTypes.EVENT_PROGRAM;

        if (enrollmentAccessLevel === enrollmentAccessLevels.LIMITED_ACCESS) {
            setStatus(missingStatuses.PROTECTED_PROGRAM_WITH_BREAKING_THE_GLASS);
        } else if (enrollmentAccessLevel === enrollmentAccessLevels.NO_ACCESS) {
            setStatus(missingStatuses.RESTRICTED_PROGRAM_NO_ACCESS);
        } else if (selectedProgramIsTracker && programSelectionIsIncomplete) {
            setStatus(missingStatuses.MISSING_PROGRAM_CATEGORIES_SELECTION);
        } else if (selectedProgramIsTracker && selectedProgramIsOfDifferentTypTetype) {
            setStatus(missingStatuses.TRACKER_PROGRAM_OF_DIFFERENT_TYPE_SELECTED);
        } else if (selectedProgramIsTracker && programHasEnrollments && !enrollmentsOnProgramContainEnrollmentId) {
            if (programHasActiveEnrollments || onlyEnrollOnce) {
                setStatus(missingStatuses.MISSING_ENROLLMENT_SELECTION);
            } else {
                setStatus(missingStatuses.MISSING_ENROLLMENT_SELECTION_ADD_NEW);
            }
        } else if (selectedProgramIsTracker && !programHasEnrollments && enrollmentAccessLevel !== enrollmentAccessLevels.UNKNOWN_ACCESS) {
            setStatus(missingStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED);
        } else if (selectedProgramIsEvent) {
            setStatus(missingStatuses.EVENT_PROGRAM_SELECTED);
        } else {
            setStatus(missingStatuses.MISSING_PROGRAM_SELECTION);
        }
    }, [
        programId,
        programSelectionIsIncomplete,
        programHasEnrollments,
        programHasActiveEnrollments,
        enrollmentsOnProgramContainEnrollmentId,
        selectedProgramIsOfDifferentTypTetype,
        scopeType,
        enrollmentAccessLevel,
        onlyEnrollOnce,
    ]);

    return { missingStatus };
};

const useNavigations = () => {
    const history = useHistory();
    const { tetId } = useSelector(({ enrollmentPage }) => enrollmentPage);

    const { programId, orgUnitId, teiId } = useLocationQuery();
    const navigateToTrackerProgramRegistrationPage = () =>
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, teiId })}`);
    const navigateToEventProgramRegistrationPage = () =>
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);
    const navigateToEventWorkingList = () =>
        history.push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
    const navigateToTetRegistrationPage = () =>
        history.push(`/new?${buildUrlQueryString({ programId, orgUnitId, trackedEntityTypeId: tetId })}`);

    return {
        navigateToTrackerProgramRegistrationPage,
        navigateToEventProgramRegistrationPage,
        navigateToEventWorkingList,
        navigateToTetRegistrationPage,
    };
};

const getStyles = () => ({
    lineHeight: { lineHeight: 1.8 },
    link: {
        background: 'transparent',
        padding: 0,
    },
});

export const MissingMessage = withStyles(getStyles)(({
    classes,
}) => {
    const dispatch = useDispatch();
    const {
        navigateToTrackerProgramRegistrationPage,
        navigateToEventProgramRegistrationPage,
        navigateToEventWorkingList,
    } = useNavigations();
    const { missingStatus } = useMissingStatus();
    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { teiDisplayName, tetId } = useSelector(({ enrollmentPage }) => enrollmentPage);
    const { programId, teiId, enrollmentId } = useLocationQuery();

    const { trackedEntityName: tetName } = useScopeInfo(tetId);
    const { programName, trackedEntityName: selectedTetName } = useScopeInfo(programId);

    return (<>
        {
            missingStatus === missingStatuses.MISSING_PROGRAM_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('Choose a program to add new or see existing enrollments for {{teiDisplayName}}', {
                    teiDisplayName, interpolation: { escapeValue: false },
                })}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.MISSING_PROGRAM_CATEGORIES_SELECTION &&
            <IncompleteSelectionsMessage>
                {i18n.t('{{programName}} has categories. Choose all categories to view dashboard.', {
                    programName,
                    interpolation: { escapeValue: false },
                })}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.MISSING_ENROLLMENT_SELECTION &&
            <IncompleteSelectionsMessage>
                {enrollmentId ?
                    i18n.t('Invalid enrollment id {{enrollmentId}}.', {
                        enrollmentId,
                        interpolation: { escapeValue: false },
                    }) :
                    i18n.t('Choose an enrollment to view the dashboard.')
                }
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.MISSING_ENROLLMENT_SELECTION_ADD_NEW &&
            <IncompleteSelectionsMessage>
                <div className={classes.lineHeight}>
                    {i18n.t('There are no active enrollments.')}
                    <div>
                        <LinkButton
                            className={classes.link}
                            onClick={navigateToTrackerProgramRegistrationPage}
                        >
                            {i18n.t('Add new enrollment for {{teiDisplayName}} in this program.', { teiDisplayName })}
                        </LinkButton>
                    </div>
                </div>
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.PROTECTED_PROGRAM_WITH_BREAKING_THE_GLASS &&
            <WidgetBreakingTheGlass
                teiId={teiId}
                programId={programId}
                onBreakingTheGlass={() => dispatch(fetchEnrollments())}
                onCancel={resetProgramIdAndEnrollmentContext}
            />
        }

        {
            missingStatus === missingStatuses.RESTRICTED_PROGRAM_NO_ACCESS &&
            <IncompleteSelectionsMessage>
                {i18n.t('No access to program owner.')}
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED &&
            <IncompleteSelectionsMessage>
                <div className={classes.lineHeight}>
                    {i18n.t('{{teiDisplayName}} is not enrolled in this program.', {
                        teiDisplayName, interpolation: { escapeValue: false },
                    })}
                    <div>
                        <LinkButton
                            className={classes.link}
                            onClick={navigateToTrackerProgramRegistrationPage}
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
                    {i18n.t('{{teiDisplayName}} is a {{tetName}} and cannot be enrolled in the {{programName}}. Choose another program that allows {{tetName}} enrollment. ', {
                        teiDisplayName, programName, tetName, interpolation: { escapeValue: false },
                    })}
                    <div>
                        <LinkButton
                            className={classes.link}
                            onClick={navigateToTrackerProgramRegistrationPage}
                        >
                            {i18n.t('Enroll a new {{selectedTetName}} in this program.', {
                                selectedTetName, interpolation: { escapeValue: false },
                            })}
                        </LinkButton>
                    </div>
                </div>
            </IncompleteSelectionsMessage>
        }

        {
            missingStatus === missingStatuses.EVENT_PROGRAM_SELECTED &&
            <IncompleteSelectionsMessage>
                <div className={classes.lineHeight}>
                    {i18n.t('{{programName}} is an event program and does not have enrollments.', {
                        programName, interpolation: { escapeValue: false },
                    })}
                    <div>
                        <LinkButton
                            className={classes.link}
                            onClick={navigateToEventProgramRegistrationPage}
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
