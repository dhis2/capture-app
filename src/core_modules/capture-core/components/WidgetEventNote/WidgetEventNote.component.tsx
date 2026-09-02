import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Props } from './WidgetEventNote.types';
import { requestAddNoteForEvent } from './WidgetEventNote.actions';
import { WidgetNote } from '../WidgetNote';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useTermLabel } from '../../metaData';
import { tCustomTerm } from '../../utils/tCustomTerm';

export const WidgetEventNote = ({ dataEntryKey, dataEntryId, programId }: Props) => {
    const dispatch = useDispatch();
    const notes = useSelector(({ dataEntriesNotes }: { dataEntriesNotes: Record<string, any[]> }) =>
        dataEntriesNotes[`${dataEntryId}-${dataEntryKey}`] ?? []);
    const {
        currentStageWriteAccess,
        trackedEntityTypeName,
        showWidgetBadge,
    } = useEnrollmentAccessContext();
    const eventLabel = useTermLabel('event');
    const noteLabel = useTermLabel('note');
    const notesLabel = useTermLabel('note', { plural: true });

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEvent(dataEntryKey, dataEntryId, newNoteValue, programId));
    };

    return (
        <div data-test="event-note-widget">
            <WidgetNote
                title={tCustomTerm('{{notesLabel}} about this {{eventLabel}}', { notesLabel, eventLabel })}
                placeholder={tCustomTerm('Write a {{noteLabel}} about this {{eventLabel}}', { eventLabel, noteLabel })}
                emptyNoteMessage={tCustomTerm(
                    "This {{eventLabel}} doesn't have any {{notesLabel}}",
                    { eventLabel, notesLabel },
                )}
                noteLabel={noteLabel}
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
