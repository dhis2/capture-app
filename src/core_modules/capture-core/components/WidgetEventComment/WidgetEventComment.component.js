// @flow
import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WidgetComment } from '../WidgetComment';
import { requestAddNoteForEvent } from './WidgetEventComment.actions';
import type { Props } from './WidgetEventComment.types';

export const WidgetEventComment = ({ itemId, dataEntryId }: Props) => {
    const dispatch = useDispatch();
    const comments = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[`${dataEntryId}-${itemId}`] ?? []);

    const onAddComment = (newCommentValue) => {
        dispatch(requestAddNoteForEvent(itemId, dataEntryId, newCommentValue));
    };

    return (
        <div data-test="event-comment-widget">
            <WidgetComment
                title={i18n.t('Comments about this event')}
                placeholder={i18n.t('Write a comment about this event')}
                emptyCommentMessage={i18n.t('This event doesn\'t have any comments')}
                comments={comments}
                onAddComment={onAddComment}
            />
        </div>
    );
};
