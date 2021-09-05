// @flow
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetComment.types';
import { CommentSection } from './CommentSection/CommentSection';
import { requestAddNoteForEvent } from './actions/WidgetComment.actions';


export const WidgetComment = ({ itemId, dataEntryId, ...passOnProps }: Props) => {
    const dispatch = useDispatch();
    const [open, setOpenStatus] = useState(true);
    const [newNoteValue, setNewNoteValue] = useState('');
    const notes = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[`${dataEntryId}-${itemId}`] ?? []);

    const onEdit = () => {};

    const onNewNoteEditorBlur = () => {};

    const handleChange = (value) => {
        setNewNoteValue(value);
    };

    const onCancel = () => {
        setNewNoteValue('');
    };

    const onAddNote = () => {
        dispatch(requestAddNoteForEvent(itemId, dataEntryId, newNoteValue));
        setNewNoteValue('');
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
                    newNoteValue={newNoteValue}
                    notes={notes}
                    onEdit={onEdit}
                    onCancel={onCancel}
                    handleChange={handleChange}
                    onNewNoteEditorBlur={onNewNoteEditorBlur}
                    handleAddNote={onAddNote}
                    {...passOnProps}
                />
            </Widget>
        </div>
    );
};
