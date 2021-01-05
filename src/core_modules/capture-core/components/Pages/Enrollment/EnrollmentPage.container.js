// @flow
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';
import { startFetchingEnrollmentPageInformation } from './EnrollmentPage.actions';

export const EnrollmentPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();

    const enrollmentId: EnrollmentPageStatus =
      useSelector(({ currentSelections }) => currentSelections.enrollmentId);

    useEffect(() => {
        enrollmentId && dispatch(startFetchingEnrollmentPageInformation());
    },
    [
        enrollmentId,
        dispatch,
    ]);

    const enrollmentPageStatus: EnrollmentPageStatus =
      useSelector(({ enrollmentPage }) => enrollmentPage.enrollmentPageStatus);

    return (
        <EnrollmentPageComponent
            enrollmentPageStatus={enrollmentPageStatus}
        />
    );
};
