// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { EnrollmentPageComponent } from './EnrollmentPage.component';
import type { EnrollmentPageStatus } from './EnrollmentPage.types';

export const EnrollmentPage: ComponentType<{||}> = () => {
    const enrollmentPageStatus: EnrollmentPageStatus =
      useSelector(({ enrollmentPage }) => enrollmentPage.enrollmentPageStatus);

    return (
        <EnrollmentPageComponent
            enrollmentPageStatus={enrollmentPageStatus}
        />
    );
};
