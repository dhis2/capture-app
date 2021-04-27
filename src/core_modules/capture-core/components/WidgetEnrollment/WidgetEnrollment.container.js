// @flow
import React from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { CircularLoader } from '@dhis2/ui';
import { WidgetEnrollment } from './WidgetEnrollment.component';
import type { Props } from './enrollment.types';

export const WidgetEnrollmentContainer = ({ trackedEntityInstances, enrollmentId }: Props) => {
    const enrollmentQuery = {
        trackedEntityInstances: {
            resource: `trackedEntityInstances/${trackedEntityInstances}`,
            params: {
                fields: ['enrollments'],
            },
        },
    };

    const enrollmentFetch = useDataQuery(enrollmentQuery);
    const { loading, error, data = {} } = enrollmentFetch;

    if (error) {
        throw error;
    }

    return !loading && data.trackedEntityInstances && data.trackedEntityInstances.enrollments ?
        <WidgetEnrollment
            enrollment={data.trackedEntityInstances.enrollments.find(v => v.enrollment === enrollmentId)}
        />
        :
        <CircularLoader small />;
};

