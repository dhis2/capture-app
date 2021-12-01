// @flow
import { Chip } from '@dhis2/ui';
import React, { useState, useCallback } from 'react';
import { Widget } from '../Widget';
import { CommentSection } from './CommentSection/CommentSection';
import type { Props } from './WidgetComment.types';

export const WidgetComment = ({ title, comments, onAddComment, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);

    return (
        <Widget
            header={<div>
                <span>{title}</span>
                {comments.length ? <Chip dense>
                    {comments.length}
                </Chip> : null}
            </div>}
            onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
            onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
            open={open}
        >
            <CommentSection
                comments={comments}
                handleAddComment={onAddComment}
                {...passOnProps}
            />
        </Widget>

    );
};
