// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { compose } from 'redux';
import type { Props } from './EnrollmentPage.types';
import { enrollmentPageStatuses } from './EnrollmentPage.constants';
import { LoadingMaskForPage } from '../../LoadingMasks/LoadingMaskForPage.component';
import { withErrorMessageHandler } from '../../../HOC';
import { MissingMessage } from './MissingMessage.component';
import { EnrollmentPageDefault } from './EnrollmentPageDefault';

const EnrollmentPagePlain = ({ enrollmentPageStatus }) => (
    <div data-test="enrollment-page-content">
        {enrollmentPageStatus === enrollmentPageStatuses.MISSING_SELECTIONS && <MissingMessage />}

        {enrollmentPageStatus === enrollmentPageStatuses.DEFAULT && <EnrollmentPageDefault />}

        {enrollmentPageStatus === enrollmentPageStatuses.LOADING && <LoadingMaskForPage />}
    </div>
);

export const EnrollmentPageComponent: ComponentType<$Diff<Props, CssClasses>> = compose(
    withErrorMessageHandler(),
)(EnrollmentPagePlain);
