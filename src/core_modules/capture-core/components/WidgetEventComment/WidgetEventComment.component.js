// @flow
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { WidgetComment } from '../WidgetComment';
import type { Props } from './WidgetEventComment.types';
import { requestAddNoteForEvent } from './WidgetEventComment.actions';

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
