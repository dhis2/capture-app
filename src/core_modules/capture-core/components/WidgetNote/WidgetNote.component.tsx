import React, { useState, useCallback } from 'react';
import { Widget } from '../Widget';
import type { Props } from './WidgetNote.types';
import { NoteSection } from './NoteSection/NoteSection';

export const WidgetNote = ({ title, notes, onAddNote, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState<boolean>(true);

    return (
        <Widget
            header={<div>
                <span>{title}</span>
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
