// @flow
import React, { useState, useCallback } from 'react';
import { Chip } from '@dhis2/ui';
import { Widget } from '../Widget';
import type { Props } from './WidgetNote.types';
import { NoteSection } from './NoteSection/NoteSection';

export const WidgetNote = ({ title, notes, onAddNote, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);

    return (
        <Widget
            header={<div>
                <span>{title}</span>
                {notes.length ? <Chip dense>
                    {notes.length}
                </Chip> : null}
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
