import React, { useState, useCallback } from 'react';
import { Widget, WidgetHeaderCountBadge } from '../Widget';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import type { Props } from './WidgetNote.types';
import { NoteSection } from './NoteSection/NoteSection';

export const WidgetNote = ({
    title,
    notes,
    onAddNote,
    ...passOnProps
}: Props) => {
    const [open, setOpenStatus] = useState<boolean>(true);
    const {
        isEventPage,
        currentStageWriteAccess,
        programWriteAccess,
        trackedEntityTypeName,
        hideWidgetBadge,
    } = useEnrollmentAccessContext();
    const readOnly = isEventPage ? !currentStageWriteAccess : !programWriteAccess;

    return (
        <Widget
            header={<div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <span>{title}</span>
                {notes.length > 0 && <WidgetHeaderCountBadge count={notes.length} />}
                {!hideWidgetBadge && (
                    <div style={{ marginInlineStart: 'auto' }}>
                        <ReadOnlyBadge
                            programWriteAccess={isEventPage ? true : programWriteAccess}
                            programStageWriteAccess={isEventPage ? currentStageWriteAccess : true}
                            trackedEntityName={trackedEntityTypeName}
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
