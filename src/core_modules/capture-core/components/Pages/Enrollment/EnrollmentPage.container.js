// @flow
import React, { useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { getScopeInfo } from '../../../metaData';
import { scopeTypes } from '../../../metaData/helpers/constants';
import { buildEnrollmentsAsOptions, useSetEnrollmentId } from '../../ScopeSelector';
import {
    cleanEnrollmentPage,
    fetchEnrollmentPageInformation,
    showDefaultViewOnEnrollmentPage,
    showMissingMessageViewOnEnrollmentPage,
} from './EnrollmentPage.actions';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';
import { useEnrollmentInfo } from './useEnrollmentInfo';

const useComponentLifecycle = () => {
    const dispatch = useDispatch();
    const { teiId, programId, enrollmentId } =
        useSelector(({ router: { location: { query } } }) => ({
            teiId: query.teidId,
            programId: query.programId,
            enrollmentId: query.enrollmentId,
        }), shallowEqual);

    const { scopeType } = useScopeInfo(programId);
    const { setEnrollmentId } = useSetEnrollmentId();

    const { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, autoEnrollmentId } = useEnrollmentInfo(enrollmentId, programId);
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
    const { programId, orgUnitId, enrollmentId } = useSelector(
        ({ router: { location: { query } } }) => ({
            teiId: query.teiId,
            programId: query.programId,
            orgUnitId: query.orgUnitId,
            enrollmentId: query.enrollmentId,
        }),
        shallowEqual,
    );
    const { tetId, enrollments, teiDisplayName } = useSelector(({ enrollmentPage }) => enrollmentPage);
    const { trackedEntityName } = getScopeInfo(tetId);
    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollments, programId);

    useEffect(() => {
        dispatch(fetchEnrollmentPageInformation());
    },
    [
        dispatch,
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
        />
    );
};
