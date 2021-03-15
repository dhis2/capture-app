// @flow
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { useEnrollmentInfo } from './hooks';

const useComponentLifecycle = () => {
    const dispatch = useDispatch();

    const { teiId, programId, enrollmentId } =
      useSelector(({ router: { location: { query } } }) =>
          ({
              teiId: query.teidId,
              programId: query.programId,
              enrollmentId: query.enrollmentId,
          }),
      );


    const { scopeType } = useScopeInfo(programId);
    const { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId } = useEnrollmentInfo(enrollmentId, programId);
    useEffect(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;

        if (selectedProgramIsTracker && programHasEnrollments && enrollmentsOnProgramContainEnrollmentId) {
            dispatch(showDefaultViewOnEnrollmentPage());
        } else if (programHasEnrollments === false || enrollmentsOnProgramContainEnrollmentId === false) {
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

export const EnrollmentPage: ComponentType<{||}> = () => {
    useComponentLifecycle();

    const dispatch = useDispatch();
    const selectedTeiId: string =
      useSelector(({ router: { location: { query } } }) => query.teiId);
    const enrollmentPageStatus: EnrollmentPageStatus =
      useSelector(({ enrollmentPage }) => enrollmentPage.enrollmentPageStatus);

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
            enrollmentPageStatus={enrollmentPageStatus}
        />
    );
};
