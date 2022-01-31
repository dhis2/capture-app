// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch, useSelector } from 'react-redux';
import { requestAddNoteForEnrollment } from './WidgetEnrollmentComment.actions';
import { WidgetComment } from '../WidgetComment';
import { useLocationQuery } from '../../utils/routing';

export const WidgetEnrollmentComment = () => {
    const dispatch = useDispatch();
    const { enrollmentId } = useLocationQuery();
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
