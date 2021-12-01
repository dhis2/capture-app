// @flow
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { WidgetComment } from '../WidgetComment';
import { requestAddNoteForEnrollment } from './WidgetEnrollmentComment.actions';

export const WidgetEnrollmentComment = () => {
    const dispatch = useDispatch();
    const enrollmentId = useSelector(({ router }) => router.location.query.enrollmentId);
    const comments = useSelector(({ enrollmentDomain }) => enrollmentDomain?.enrollment?.notes ?? []);

    const onAddComment = (newCommentValue) => {
        dispatch(requestAddNoteForEnrollment(enrollmentId, newCommentValue));
    };

    return (
        <div data-test="enrollment-comment-widget">
            <WidgetComment
                title={i18n.t('Comments about this enrollment')}
                placeholder={i18n.t('Write a comment about this enrollment')}
                emptyCommentMessage={i18n.t('This enrollment doesn\'t have any comments')}
                comments={comments}
                onAddComment={onAddComment}
            />
        </div>
    );
};
