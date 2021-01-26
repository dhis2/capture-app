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
    showMissingProgramMessageOnEnrollmentPage,
    showMissingEnrollmentMessageOnEnrollmentPage,
    showEventProgramMessageOnEnrollmentPage,
    showMissingCategoryMessageOnEnrollmentPage,
    showZeroEnrollmentsMessageOnEnrollmentPage,
} from './EnrollmentPage.actions';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { useMissingCategoriesInProgramSelection } from '../../../hooks/useMissingCategoriesInProgramSelection';

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

    // todo annotate
    const enrollments: Object = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const programHasEnrollments = enrollments && enrollments.some(({ program }) => programId === program);
    const { scopeType } = useScopeInfo(programId);
    const { programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();

    useEffect(() => {
        const selectedProgramIsTracker = programId && scopeType === scopeTypes.TRACKER_PROGRAM;
        const selectedProgramIsEvent = programId && scopeType === scopeTypes.EVENT_PROGRAM;

        if (selectedProgramIsTracker && programSelectionIsIncomplete) {
            dispatch(showMissingCategoryMessageOnEnrollmentPage());
        } else if (selectedProgramIsTracker && programHasEnrollments && enrollmentId) {
            dispatch(showDefaultViewOnEnrollmentPage());
        } else if (selectedProgramIsTracker && programHasEnrollments && !enrollmentId) {
            dispatch(showMissingEnrollmentMessageOnEnrollmentPage());
        } else if (selectedProgramIsTracker && !programHasEnrollments) {
            dispatch(showZeroEnrollmentsMessageOnEnrollmentPage());
        } else if (selectedProgramIsEvent) {
            dispatch(showEventProgramMessageOnEnrollmentPage());
        } else {
            dispatch(showMissingProgramMessageOnEnrollmentPage());
        }
    }, [
        dispatch,
        programId,
        enrollmentId,
        programSelectionIsIncomplete,
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
    // todo there is a bug when you have http://localhost:3000/#/enrollment?teiId=EaOyKGOIGRp&enrollmentId=W9YcBFADeRj
    // because you have both tei and enrollmentId it stucks in an attermon loop
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
