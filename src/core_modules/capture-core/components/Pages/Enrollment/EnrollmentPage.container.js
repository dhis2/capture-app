// @flow
import React, { useEffect, useMemo, useCallback } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';
import {
    cleanEnrollmentPage,
    fetchEnrollmentPageInformation,
    fetchEnrollments,
    updateEnrollmentAccessLevel,
    showDefaultViewOnEnrollmentPage,
    showMissingMessageViewOnEnrollmentPage,
} from './EnrollmentPage.actions';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useEnrollmentInfo } from './useEnrollmentInfo';
import { enrollmentPageStatuses, enrollmentAccessLevels } from './EnrollmentPage.constants';
import { getScopeInfo } from '../../../metaData';
import {
    buildEnrollmentsAsOptions,
    useSetEnrollmentId,
    useSetProgramId,
    useResetProgramId,
} from '../../ScopeSelector';
import { useLocationQuery } from '../../../utils/routing';

const useComponentLifecycle = () => {
    const dispatch = useDispatch();
    const { teiId, programId, enrollmentId } = useLocationQuery();

    const { scopeType } = useScopeInfo(programId);
    const { setEnrollmentId } = useSetEnrollmentId();

    const { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, autoEnrollmentId } = useEnrollmentInfo(enrollmentId, programId, teiId);
    useEffect(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;
        if (enrollmentId === 'AUTO' && autoEnrollmentId) {
            setEnrollmentId({ enrollmentId: autoEnrollmentId, shouldReplaceHistory: true });
        } else if (selectedProgramIsTracker && programHasEnrollments && enrollmentsOnProgramContainEnrollmentId) {
            dispatch(showDefaultViewOnEnrollmentPage());
        } else {
            dispatch(showMissingMessageViewOnEnrollmentPage());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dispatch,
        programId,
        enrollmentsOnProgramContainEnrollmentId,
        programHasEnrollments,
        scopeType,
        enrollmentId,
        autoEnrollmentId,
    ]);

    useEffect(() => () => dispatch(cleanEnrollmentPage()), [dispatch, teiId]);
};

// dirty fix for scenarios where you deselect the program.
// This should be removed as part of fixing the url sync issue, https://jira.dhis2.org/browse/TECH-580
const useComputedEnrollmentPageStatus = () => {
    const enrollmentPageStatus: EnrollmentPageStatus =
    useSelector(({ enrollmentPage }) => enrollmentPage.enrollmentPageStatus);

    const { teiId, programId, enrollmentId } = useLocationQuery();
    const { scopeType } = useScopeInfo(programId);

    return useMemo(() => {
        if (scopeType === scopeTypes.EVENT_PROGRAM) {
            return enrollmentPageStatuses.MISSING_SELECTIONS;
        }
        if (enrollmentPageStatus === enrollmentPageStatuses.DEFAULT &&
            !(programId && teiId && enrollmentId)) {
            return enrollmentPageStatuses.LOADING;
        }
        return enrollmentPageStatus;
    }, [
        scopeType,
        enrollmentPageStatus,
        enrollmentId,
        teiId,
        programId,
    ]);
};

export const EnrollmentPage: ComponentType<{||}> = () => {
    useComponentLifecycle();

    const dispatch = useDispatch();
    const { programId, orgUnitId, enrollmentId, teiId } = useLocationQuery();
    const { tetId, enrollments, teiDisplayName } = useSelector(({ enrollmentPage }) => enrollmentPage);
    const { trackedEntityName } = getScopeInfo(tetId);
    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollments, programId);
    const { setProgramId } = useSetProgramId();
    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();

    const selectProgramHandler = useCallback(
        (id) => {
            setProgramId(id);
            dispatch(fetchEnrollments());
        },
        [dispatch, setProgramId],
    );

    const deselectProgramHandler = useCallback(
        () => {
            resetProgramIdAndEnrollmentContext();
            dispatch(updateEnrollmentAccessLevel({ accessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS }));
        },
        [dispatch, resetProgramIdAndEnrollmentContext],
    );

    useEffect(() => {
        dispatch(fetchEnrollmentPageInformation());
    },
    [
        dispatch,
        teiId,
    ]);

    const error: boolean =
      useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);

    return (
        <EnrollmentPageComponent
            error={error}
            programId={programId}
            orgUnitId={orgUnitId}
            enrollmentId={enrollmentId}
            teiDisplayName={teiDisplayName}
            trackedEntityName={trackedEntityName}
            enrollmentsAsOptions={enrollmentsAsOptions}
            enrollmentPageStatus={useComputedEnrollmentPageStatus()}
            selectProgramHandler={selectProgramHandler}
            deselectProgramHandler={deselectProgramHandler}
        />
    );
};
