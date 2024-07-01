// @flow
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './WidgetEventNote.types';
import { requestAddNoteForEvent } from './WidgetEventNote.actions';
import { WidgetNote } from '../WidgetNote';

export const WidgetEventNote = ({ dataEntryKey, dataEntryId }: Props) => {
    const dispatch = useDispatch();
    const notes = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[`${dataEntryId}-${dataEntryKey}`] ?? []);

    const onAddNote = (newNoteValue) => {
        dispatch(requestAddNoteForEvent(dataEntryKey, dataEntryId, newNoteValue));
    };

    return (
        <div data-test="event-note-widget">
            <WidgetNote
                title={i18n.t('Notes about this event')}
                placeholder={i18n.t('Write a note about this event')}
                emptyNoteMessage={i18n.t('This event doesn\'t have any notes')}
                notes={notes}
                onAddNote={onAddNote}
            />
        </div>
    );
};
