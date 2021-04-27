// @flow
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrollment } from './WidgetEnrollment.actions';
import { WidgetEnrollment } from './WidgetEnrollment.component';

export const WidgetEnrollmentContainer = ({ trackedEntityInstances, enrollmentId }: Props) => {
    const dispatch = useDispatch();
    const enrollments = useSelector(({ widgetEnrollment }) => widgetEnrollment.enrollments);
    useEffect(() => {
        dispatch(fetchEnrollment());
    },
    [
        trackedEntityInstances,
        dispatch,
    ]);

    return (
        <WidgetEnrollment enrollment={enrollments.find(v => v.enrollment === enrollmentId)} />
    );
};

