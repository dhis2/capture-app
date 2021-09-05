// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetComment.types';
import { CommentSection } from './CommentSection/CommentSection';


export const WidgetComment = ({ notes, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);

    return (
        <div
            data-test="comment-widget"
        >
            <Widget
                header={i18n.t('Comments about this event')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <CommentSection notes={notes} {...passOnProps} />
            </Widget>
        </div>
    );
};
