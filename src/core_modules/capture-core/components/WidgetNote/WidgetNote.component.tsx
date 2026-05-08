import React, { useState, useCallback } from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Widget, WidgetHeaderCountBadge } from '../Widget';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useWidgetNoteAccess } from './useWidgetNoteAccess';
import type { Props } from './WidgetNote.types';
import { NoteSection } from './NoteSection/NoteSection';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: `${spacersNum.dp8}px`,
        flex: 1,
    },
    badge: {
        marginInlineStart: 'auto',
    },
};

const WidgetNotePlain = ({
    classes,
    title,
    notes,
    scope,
    onAddNote,
    ...passOnProps
}: Props & WithStyles<typeof styles>) => {
    const [open, setOpenStatus] = useState<boolean>(true);
    const {
        readOnly,
        showBadge,
        programWriteAccess,
        programStageWriteAccess,
        trackedEntityTypeName,
    } = useWidgetNoteAccess(scope);

    return (
        <Widget
            header={<div className={classes.header}>
                <span>{title}</span>
                {notes.length > 0 && <WidgetHeaderCountBadge count={notes.length} />}
                {showBadge && (
                    <div className={classes.badge}>
                        <ReadOnlyBadge
                            programWriteAccess={programWriteAccess}
                            programStageWriteAccess={programStageWriteAccess}
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

export const WidgetNote = withStyles(styles)(WidgetNotePlain);
