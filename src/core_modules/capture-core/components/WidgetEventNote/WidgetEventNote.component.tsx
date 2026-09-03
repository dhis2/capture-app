import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Props } from './WidgetEventNote.types';
import { requestAddNoteForEvent } from './WidgetEventNote.actions';
import { WidgetNote } from '../WidgetNote';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useTermLabel } from '../../metaData';

export const WidgetEventNote = ({ dataEntryKey, dataEntryId, programId }: Props) => {
    const dispatch = useDispatch();
    const notes = useSelector(({ dataEntriesNotes }: { dataEntriesNotes: Record<string, any[]> }) =>
        dataEntriesNotes[`${dataEntryId}-${dataEntryKey}`] ?? []);
    const {
        currentStageWriteAccess,
        trackedEntityTypeName,
        showWidgetBadge,
    } = useEnrollmentAccessContext();
    const eventLabel = useTermLabel('event', { programId });
    const noteLabel = useTermLabel('note', { programId });

    const onAddNote = (newNoteValue: string) => {
        dispatch(requestAddNoteForEvent(dataEntryKey, dataEntryId, newNoteValue, programId));
    };

    return (
        <div data-test="event-note-widget">
            <WidgetNote
                title={i18n.t('Notes about this {{eventLabel}}', { eventLabel })}
                placeholder={i18n.t(
                    'Write a {{noteLabel}} about this {{eventLabel}}',
                    { eventLabel, noteLabel },
                )}
                emptyNoteMessage={i18n.t("This {{eventLabel}} doesn't have any notes", { eventLabel })}
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
