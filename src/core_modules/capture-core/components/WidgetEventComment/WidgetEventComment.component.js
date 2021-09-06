// @flow
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Props } from './WidgetEventComment.types';
import { requestAddNoteForEvent } from './WidgetEventComment.actions';
import { WidgetComment } from '../WidgetComment';

export const WidgetEventComment = ({ itemId, dataEntryId }: Props) => {
    const dispatch = useDispatch();
    const notes = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[`${dataEntryId}-${itemId}`] ?? []);

    const onAddNote = (newNoteValue) => {
        dispatch(requestAddNoteForEvent(itemId, dataEntryId, newNoteValue));
    };

    return (
        <div data-test="event-comment-widget"><WidgetComment notes={notes} onAddNote={onAddNote} /></div>
    );
};
