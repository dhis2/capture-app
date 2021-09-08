// @flow
import React, { useState, useCallback } from 'react';
import { Chip } from '@dhis2/ui';
import { Widget } from '../Widget';
import type { Props } from './WidgetComment.types';
import { CommentSection } from './CommentSection/CommentSection';

export const WidgetComment = ({ title, notes, onAddNote, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);

    return (
        <Widget
            header={<>
                <span>{title}</span>
                {notes.length ? <Chip dense>
                    {notes.length}
                </Chip> : null}
            </>}
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

    );
};
