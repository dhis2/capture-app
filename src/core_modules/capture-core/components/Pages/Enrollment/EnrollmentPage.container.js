// @flow
import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';
import {
    openEnrollmentPage,
    cleanEnrollmentPage,
    changedEnrollmentId,
    changedTeiId,
    changedProgramId,
    fetchEnrollmentPageInformation,
    fetchEnrollments,
    showDefaultViewOnEnrollmentPage,
    showMissingMessageViewOnEnrollmentPage,
    showLoadingViewOnEnrollmentPage,
} from './EnrollmentPage.actions';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useEnrollmentInfo } from './useEnrollmentInfo';
import { enrollmentPageStatuses, enrollmentAccessLevels } from './EnrollmentPage.constants';
import { getScopeInfo } from '../../../metaData';
import {
    buildEnrollmentsAsOptions,
    useSetEnrollmentId,
} from '../../ScopeSelector';
import { useLocationQuery, getLocationQuery } from '../../../utils/routing';

const useComponentLifecycle = () => {
    const dispatch = useDispatch();
    const { teiId, programId, enrollmentId } = useLocationQuery();

    const { scopeType } = useScopeInfo(programId);
    const { setEnrollmentId } = useSetEnrollmentId();
    const { enrollmentAccessLevel, programId: enrollmentProgramId } = useSelector(({ enrollmentPage }) => enrollmentPage);

    const { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, autoEnrollmentId } = useEnrollmentInfo(enrollmentId, programId, teiId);
    useEffect(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;
        if (enrollmentId === 'AUTO' && autoEnrollmentId) {
            setEnrollmentId({ enrollmentId: autoEnrollmentId, shouldReplaceHistory: true });
        } else if (selectedProgramIsTracker && programHasEnrollments && enrollmentsOnProgramContainEnrollmentId) {
            dispatch(showDefaultViewOnEnrollmentPage());
        } else if (programId === enrollmentProgramId) {
            dispatch(showMissingMessageViewOnEnrollmentPage());
        } else {
            dispatch(showLoadingViewOnEnrollmentPage());
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
        enrollmentAccessLevel,
        enrollmentProgramId,
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

    useEffect(() => {
        dispatch(openEnrollmentPage());
    }, []);

    useEffect(() => { dispatch(changedEnrollmentId(enrollmentId)) }, [dispatch, enrollmentId]);
    useEffect(() => { dispatch(changedTeiId({ teiId })) }, [dispatch, teiId])
    useEffect(() => { dispatch(changedProgramId({ programId })) }, [dispatch, programId]);

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
        />
    );
};
