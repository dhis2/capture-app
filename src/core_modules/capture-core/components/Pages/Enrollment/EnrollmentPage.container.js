// @flow
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';
import { cleanEnrollmentPage, fetchEnrollmentPageInformation } from './EnrollmentPage.actions';

export const EnrollmentPage: ComponentType<{||}> = () => {
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
    useEffect(() => () => dispatch(cleanEnrollmentPage()), [dispatch]);

    const error: boolean =
      useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);

    return (
        <EnrollmentPageComponent
            error={error}
            enrollmentPageStatus={enrollmentPageStatus}
        />
    );
};
