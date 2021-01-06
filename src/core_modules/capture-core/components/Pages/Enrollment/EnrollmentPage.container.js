// @flow
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';
import { cleanEnrollmentPage, startFetchingEnrollmentPageInformation } from './EnrollmentPage.actions';

export const EnrollmentPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();

    const enrollmentId: EnrollmentPageStatus =
      useSelector(({ currentSelections }) => currentSelections.enrollmentId);
    const enrollments: Object =
      useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);

    useEffect(() => {
        const enrollmentIsNotPreset = !(enrollments && enrollments.some(({ enrollment }) => enrollmentId === enrollment));
        enrollmentIsNotPreset && dispatch(startFetchingEnrollmentPageInformation());
    },
    [
        enrollments,
        enrollmentId,
        dispatch,
    ]);
    useEffect(() => () => dispatch(cleanEnrollmentPage()), [dispatch]);

    const enrollmentPageStatus: EnrollmentPageStatus =
      useSelector(({ enrollmentPage }) => enrollmentPage.enrollmentPageStatus);
    return (
        <EnrollmentPageComponent
            enrollmentPageStatus={enrollmentPageStatus}
        />
    );
};
