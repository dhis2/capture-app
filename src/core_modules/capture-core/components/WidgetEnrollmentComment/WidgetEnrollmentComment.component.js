// @flow
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestAddNoteForEnrollment } from './WidgetEnrollmentComment.actions';
import { WidgetComment } from '../WidgetComment';

export const WidgetEnrollmentComment = () => {
    const dispatch = useDispatch();
    const enrollmentId = useSelector(({ router }) => router.location.query.enrollmentId);
    const notes = useSelector(({ enrollmentSite }) => enrollmentSite?.notes ?? []);

    const onAddNote = (newNoteValue) => {
        dispatch(requestAddNoteForEnrollment(enrollmentId, newNoteValue));
    };

    return (
        <div data-test="enrollment-comment-widget"><WidgetComment notes={notes} onAddNote={onAddNote} /></div>
    );
};
