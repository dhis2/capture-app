import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useDispatch, useSelector } from 'react-redux';
import type { Props } from './WidgetEventNote.types';
import { requestAddNoteForEvent } from './WidgetEventNote.actions';
import { WidgetNote } from '../WidgetNote';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useTermLabel } from '../../metaData';
import { tCustomTerm } from '../../utils/tCustomTerm';

export const WidgetEventNote = ({ dataEntryKey, dataEntryId }: Props) => {
    const dispatch = useDispatch();
    const notes = useSelector(({ dataEntriesNotes }: { dataEntriesNotes: Record<string, any[]> }) =>
        dataEntriesNotes[`${dataEntryId}-${dataEntryKey}`] ?? []);
    const {
        currentStageWriteAccess,
        trackedEntityTypeName,
        showWidgetBadge,
    } = useEnrollmentAccessContext();
    const notesLabel = useTermLabel('note', { plural: true });

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEvent(dataEntryKey, dataEntryId, newNoteValue));
    };

    return (
        <div data-test="event-note-widget">
            <WidgetNote
                title={tCustomTerm('{{notesLabel}} about this event', { notesLabel })}
                placeholder={i18n.t('Write a note about this event')}
                emptyNoteMessage={tCustomTerm("This event doesn't have any {{notesLabel}}", { notesLabel })}
                notes={notes}
                readOnly={!currentStageWriteAccess}
                badge={showWidgetBadge ? (
                    <ReadOnlyBadge
                        programStageWriteAccess={currentStageWriteAccess}
                        trackedEntityName={trackedEntityTypeName}
                    />
                ) : null}
                onAddNote={onAddNote}
            />
        </div>
    );
};
