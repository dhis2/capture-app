// @flow
import React, { useState, useCallback } from 'react';
import { Chip } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetComment.types';
import { CommentSection } from './CommentSection/CommentSection';

export const WidgetComment = ({ notes, onAddNote, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);

    return (
        <Widget
            header={<div>
                <span>{i18n.t('Comments about this event')}</span>
                {notes.length ? <Chip dense>
                    {notes.length}
                </Chip> : null}
            </div>}
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
