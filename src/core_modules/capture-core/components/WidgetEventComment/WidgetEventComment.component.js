// @flow
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Props } from './WidgetEventComment.types';
import { requestAddNoteForEvent } from './WidgetEventComment.actions';
import { WidgetComment } from '../WidgetComment';

export const WidgetEventComment = ({ itemId, dataEntryId }: Props) => {
    const dispatch = useDispatch();
    const notes = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[`${dataEntryId}-${itemId}`] ?? []);

    const onAddComment = (newCommentValue) => {
        dispatch(requestAddNoteForEvent(itemId, dataEntryId, newCommentValue));
    };

    return (
        <div data-test="event-comment-widget"><WidgetComment comments={notes} onAddComment={onAddComment} /></div>
    );
};
