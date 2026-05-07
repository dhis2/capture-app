import React, { useState, useCallback } from 'react';
import { Widget, WidgetHeaderCountBadge } from '../Widget';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import type { Props } from './WidgetNote.types';
import { NoteSection } from './NoteSection/NoteSection';

export const WidgetNote = ({
    title,
    notes,
    onAddNote,
    readOnly,
    programWriteAccess,
    trackedEntityTypeWriteAccess,
    programStageWriteAccess,
    trackedEntityName,
    hideReadOnlyBadge,
    ...passOnProps
}: Props) => {
    const [open, setOpenStatus] = useState<boolean>(true);

    return (
        <Widget
            header={<div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <span>{title}</span>
                {notes.length > 0 && <WidgetHeaderCountBadge count={notes.length} />}
                {!hideReadOnlyBadge && (
                    <div style={{ marginInlineStart: 'auto' }}>
                        <ReadOnlyBadge
                            readOnly={readOnly}
                            programWriteAccess={programWriteAccess}
                            trackedEntityTypeWriteAccess={trackedEntityTypeWriteAccess}
                            programStageWriteAccess={programStageWriteAccess}
                            trackedEntityName={trackedEntityName}
                        />
                    </div>
                )}
            </div>}
            onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
            onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
            open={open}
        >
            <NoteSection
                notes={notes}
                handleAddNote={onAddNote}
                readOnly={readOnly}
                {...passOnProps}
            />
        </Widget>
    );
};
