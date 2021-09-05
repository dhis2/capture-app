// @flow
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetComment.types';
import { CommentSection } from './CommentSection/CommentSection';
import { requestAddNoteForEvent } from './WidgetComment.actions';


export const WidgetComment = ({ itemId, dataEntryId, ...passOnProps }: Props) => {
    const dispatch = useDispatch();
    const [open, setOpenStatus] = useState(true);
    const notes = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[`${dataEntryId}-${itemId}`] ?? []);

    const onAddNote = (newNoteValue) => {
        dispatch(requestAddNoteForEvent(itemId, dataEntryId, newNoteValue));
    };

    return (
        <div
            data-test="comment-widget"
        >
            <Widget
                header={i18n.t('Comments about this event')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <CommentSection
                    notes={notes}
                    handleAddNote={onAddNote}
                    {...passOnProps}
                />
            </Widget>
        </div>
    );
};
