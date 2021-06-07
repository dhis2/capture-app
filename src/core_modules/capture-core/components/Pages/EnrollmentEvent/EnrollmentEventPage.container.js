// @flow
import React, { useState } from 'react';
import { pageMode } from './EnrollmentEventPage.const';
import { EnrollmentEventPageComponent } from './EnrollmentEventPage.component';

export const EnrollmentEventPage = () => {
    const [mode] = useState(pageMode.VIEW);

    return <EnrollmentEventPageComponent mode={mode} />;
};
