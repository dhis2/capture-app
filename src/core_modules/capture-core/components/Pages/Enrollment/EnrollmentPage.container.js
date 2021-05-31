// @flow
import React, { useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';
import {
    cleanEnrollmentPage,
    fetchEnrollmentPageInformation,
    showDefaultViewOnEnrollmentPage,
    showMissingMessageViewOnEnrollmentPage,
} from './EnrollmentPage.actions';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useEnrollmentInfo } from './hooks/useEnrollmentInfo';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';

const useComponentLifecycle = () => {
    const dispatch = useDispatch();
    const { teiId, programId, enrollmentId } =
        useSelector(({ router: { location: { query } } }) => ({
            teiId: query.teidId,
            programId: query.programId,
            enrollmentId: query.enrollmentId,
        }), shallowEqual);

    const { scopeType } = useScopeInfo(programId);
    const { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId } = useEnrollmentInfo(enrollmentId, programId);
    useEffect(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;

        if (selectedProgramIsTracker && programHasEnrollments && enrollmentsOnProgramContainEnrollmentId) {
            dispatch(showDefaultViewOnEnrollmentPage());
        } else {
            dispatch(showMissingMessageViewOnEnrollmentPage());
        }
    }, [
        dispatch,
        programId,
        enrollmentsOnProgramContainEnrollmentId,
        programHasEnrollments,
        scopeType,
    ]);

    useEffect(() => () => dispatch(cleanEnrollmentPage()), [dispatch, teiId]);
};

// dirty fix for scenarios where you deselect the program.
// This should be removed as part of fixing the url sync issue, https://jira.dhis2.org/browse/TECH-580
const useComputedEnrollmentPageStatus = () => {
    const enrollmentPageStatus: EnrollmentPageStatus =
    useSelector(({ enrollmentPage }) => enrollmentPage.enrollmentPageStatus);

    const { teiId, programId, enrollmentId } =
        useSelector(({ router: { location: { query } } }) => ({
            teiId: query.teiId,
            programId: query.programId,
            enrollmentId: query.enrollmentId,
        }), shallowEqual);

    return useMemo(() => {
        if (enrollmentPageStatus === enrollmentPageStatuses.DEFAULT &&
            !(programId && teiId && enrollmentId)) {
            return enrollmentPageStatuses.LOADING;
        }
        return enrollmentPageStatus;
    }, [
        enrollmentPageStatus,
        enrollmentId,
        teiId,
        programId,
    ]);
};

export const EnrollmentPage: ComponentType<{||}> = () => {
    useComponentLifecycle();

    const dispatch = useDispatch();
    const selectedTeiId: string =
      useSelector(({ router: { location: { query } } }) => query.teiId);

    useEffect(() => {
        dispatch(fetchEnrollmentPageInformation());
    },
    [
        selectedTeiId,
        dispatch,
    ]);

    const error: boolean =
      useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);

    return (
        <EnrollmentPageComponent
            error={error}
            enrollmentPageStatus={useComputedEnrollmentPageStatus()}
        />
    );
};
