// @flow
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './WidgetEventComment.types';
import { requestAddNoteForEvent } from './WidgetEventComment.actions';
import { WidgetComment } from '../WidgetComment';

export const WidgetEventComment = ({ dataEntryKey, dataEntryId }: Props) => {
    const dispatch = useDispatch();
    const comments = useSelector(({ dataEntriesNotes }) => dataEntriesNotes[`${dataEntryId}-${dataEntryKey}`] ?? []);

    const onAddComment = (newCommentValue) => {
        dispatch(requestAddNoteForEvent(dataEntryKey, dataEntryId, newCommentValue));
    };

    return (
        <div data-test="event-comment-widget">
            <WidgetComment
                title={i18n.t('Comments about this event')}
                placeholder={i18n.t('Write a comment about this event')}
                emptyCommentMessage={i18n.t('This event doesn\'t have any comments')}
                comments={comments}
                onAddComment={onAddComment}
            />
        </div>
    );
};
