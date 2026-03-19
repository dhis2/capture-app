import React, { useState, useCallback } from 'react';
import { Widget, WidgetHeaderCountBadge } from '../Widget';
import type { Props } from './WidgetNote.types';
import { NoteSection } from './NoteSection/NoteSection';

export const WidgetNote = ({ title, notes, onAddNote, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState<boolean>(true);

    return (
        <Widget
            header={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{title}</span>
                {notes.length > 0 && <WidgetHeaderCountBadge count={notes.length} />}
            </div>}
            onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
            onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
            open={open}
        >
            <NoteSection
                notes={notes}
                handleAddNote={onAddNote}
                {...passOnProps}
            />
        </Widget>
    );
};
