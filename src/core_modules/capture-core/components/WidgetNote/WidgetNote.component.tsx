import React, { useState, useCallback } from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Widget, WidgetHeaderCountBadge } from '../Widget';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
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
    onAddNote,
    ...passOnProps
}: Props & WithStyles<typeof styles>) => {
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
            header={<div className={classes.header}>
                <span>{title}</span>
                {notes.length > 0 && <WidgetHeaderCountBadge count={notes.length} />}
                {!hideWidgetBadge && (
                    <div className={classes.badge}>
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

export const WidgetNote = withStyles(styles)(WidgetNotePlain);
