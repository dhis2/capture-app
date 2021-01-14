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

    const selectedTeiId: EnrollmentPageStatus = useSelector(({ currentSelections }) => currentSelections.teiId);
    const selectedProgramId: string = useSelector(({ currentSelections }) => currentSelections.programId);
    const selectedEnrollmentId: string = useSelector(({ currentSelections }) => currentSelections.enrollmentId);
    // todo annotate
    const enrollments: Object = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const programHasEnrollments = enrollments && enrollments.some(({ program }) => selectedProgramId === program);
    const { scopeType } = useScopeInfo(selectedProgramId);
    const { programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();

    useEffect(() => {
        const selectedProgramIsTracker = selectedProgramId && scopeType === scopeTypes.TRACKER_PROGRAM;
        const selectedProgramIsEvent = selectedProgramId && scopeType === scopeTypes.EVENT_PROGRAM;

        if (selectedProgramIsTracker && programSelectionIsIncomplete) {
            dispatch(showMissingCategoryMessageOnEnrollmentPage());
        } else if (selectedProgramIsTracker && programHasEnrollments && selectedEnrollmentId) {
            dispatch(showDefaultViewOnEnrollmentPage());
        } else if (selectedProgramIsTracker && programHasEnrollments && !selectedEnrollmentId) {
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
        selectedProgramId,
        selectedEnrollmentId,
        programSelectionIsIncomplete,
        programHasEnrollments,
        scopeType,
    ]);
    useEffect(() => () => dispatch(cleanEnrollmentPage()), [dispatch, selectedTeiId]);
};

export const EnrollmentPage: ComponentType<{||}> = () => {
    useComponentLifecycle();

    const dispatch = useDispatch();
    const selectedTeiId: EnrollmentPageStatus =
      useSelector(({ currentSelections }) => currentSelections.teiId);
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
